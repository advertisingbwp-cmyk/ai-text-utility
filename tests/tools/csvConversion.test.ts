import test from 'node:test';
import assert from 'node:assert/strict';
import {convertCsvToJson as csv, parseCsvRows} from '../../lib/tools/csvToJson.ts';
import {convertJsonToCsv as json} from '../../lib/tools/jsonToCsv.ts';
import {readConversionFile, MAX_CONVERSION_BYTES} from '../../lib/tools/csvConversion.ts';

const parsed = (s: string) => JSON.parse(csv(s));
const cases: [string, string, unknown][] = [
  ['comma', 'name,age\nAli,25', [{name:'Ali',age:'25'}]],
  ['quoted comma', 'name,note\nAli,"hello, world"', [{name:'Ali',note:'hello, world'}]],
  ['escaped quotes', 'note\n"He said ""hello"""', [{note:'He said "hello"'}]],
  ['embedded LF', 'note\n"one\ntwo"', [{note:'one\ntwo'}]],
  ['embedded CRLF', 'note\r\n"one\r\ntwo"', [{note:'one\r\ntwo'}]],
  ['CRLF', 'a,b\r\n1,2\r\n', [{a:'1',b:'2'}]],
  ['LF', 'a,b\n1,2\n', [{a:'1',b:'2'}]],
  ['BOM quoted header', '\uFEFF"a",b\n1,2', [{a:'1',b:'2'}]],
  ['empty and missing', 'a,b,c\n1,,3\n,2,\n4', [{a:'1',b:'',c:'3'},{a:'',b:'2',c:''},{a:'4',b:'',c:''}]],
  ['trailing empties', 'a,b,c\n1,,', [{a:'1',b:'',c:''}]],
  ['all empty row', 'a,b\n,\n', [{a:'',b:''}]],
  ['empty quoted row', 'a\n""', [{a:''}]],
  ['duplicates', 'name,name,name\nAli,Khan,Third', [{name:'Ali',name_2:'Khan',name_3:'Third'}]],
  ['reserved duplicate suffix', 'name,name,name_2\n1,2,3', [{name:'1',name_3:'2',name_2:'3'}]],
  ['empty headers', ',name,,age\n1,Ali,3,25', [{column_1:'1',name:'Ali',column_3:'3',age:'25'}]],
  ['empty collision', ',column_1\n1,2', [{column_1_2:'1',column_1:'2'}]],
  ['extra columns', 'a\n1,2,3', [{a:'1',column_2:'2',column_3:'3'}]],
  ['whitespace preserved', ' a ,b\n 1 , ', [{' a ':' 1 ',b:' '}]],
  ['large integer string', 'id\n90071992547409931234', [{id:'90071992547409931234'}]],
];
for (const [name,input,expected] of cases) test('CSV '+name,()=>assert.deepEqual(parsed(input),expected));

test('real TSV large-ID round trip preserves every digit',()=>{
  const input='id\tname\n90071992547409931234\tAli';
  const output=csv(input,{delimiter:'\t'});
  assert.equal(JSON.parse(output)[0].id,'90071992547409931234');
  assert.equal(json(output,{delimiter:'\t'}),input);
});
test('literal backslash-t rejected in both directions',()=>{
  assert.throws(()=>csv('a\tb\n1\t2',{delimiter:'\\t'}),/real tab/);
  assert.throws(()=>json('[{"a":1}]',{delimiter:'\\t'}),/real tab/);
});
test('special keys remain ordinary own data with no prototype pollution',()=>{
  const output=parsed('__proto__,constructor,prototype\nx,y,z')[0];
  assert.equal(Object.getPrototypeOf(output),Object.prototype);
  assert.deepEqual(Object.keys(output),['__proto__','constructor','prototype']);
  assert.equal(output.__proto__,'x');
  assert.equal(output.constructor,'y');
  assert.equal(output.prototype,'z');
  assert.equal(Object.hasOwn(Object.prototype,'x'),false);
  assert.equal(json('[{"__proto__":"x","constructor":"y","prototype":"z"},{}]'),'__proto__,constructor,prototype\nx,y,z\n,,');
});
test('optional inference only canonical safe integers, booleans and null',()=>{
  const input='a,b,c,d,e,f,g,h,i,j\n25,true,false,null,90071992547409931234,001,1.20,1e3, 2 ,-0';
  assert.deepEqual(JSON.parse(csv(input,{parseNumbersAndBooleans:true}))[0],{a:25,b:true,c:false,d:null,e:'90071992547409931234',f:'001',g:'1.20',h:'1e3',i:' 2 ',j:'-0'});
});
test('headerless CSV arrays retain blank cells',()=>assert.deepEqual(JSON.parse(csv('1,,3',{hasHeaders:false})),[['1','','3']]));
test('JSON union keeps first-seen keys',()=>assert.equal(json('[{"a":1,"b":2},{"b":3,"c":4}]'),'a,b,c\n1,2,\n,3,4'));
test('nested object and array compact JSON with escaping',()=>{
  const rows=parseCsvRows(json('[{"obj":{"x":1},"tags":["a","b"]}]'));
  assert.deepEqual(rows,[['obj','tags'],['{"x":1}','["a","b"]']]);
});
test('JSON strings numbers booleans null and absent',()=>assert.equal(json('[{"s":"x","n":1.25,"t":true,"f":false,"nil":null},{}]'),'s,n,t,f,nil\nx,1.25,true,false,\n,,,,'));
test('CSV writer escapes delimiter quotes CR LF and headers',()=>{
  const data=[{'a,b':'He said "hello"',cr:'a\rb',lf:'a\nb',tab:'a\tb'}];
  for(const delimiter of [',','\t',';','|']) assert.deepEqual(parseCsvRows(json(JSON.stringify(data),{delimiter}),delimiter),[Object.keys(data[0]),Object.values(data[0])]);
  assert.equal(json('[{"a":"x"}]',{quoteAll:true}),'"a"\n"x"');
});
for(const input of ['a\n"unfinished','a\nb"c','a\n"b"x']) test('malformed CSV '+JSON.stringify(input),()=>assert.throws(()=>csv(input),/Malformed CSV/));
test('invalid JSON returns actionable error without stack',()=>assert.throws(()=>json('{bad'),/^Error: Invalid JSON: check/));
test('unsupported and empty structures report errors',()=>{
  for(const input of ['null','1','true','"text"','[1]','[[]]']) assert.throws(()=>json(input),/Unsupported structure/);
  for(const input of ['[]','[{}]']) assert.throws(()=>json(input),/No (records|columns)/);
  for(const f of [csv,json]) assert.throws(()=>f(''),/Enter/);
});
test('unsafe JSON integer literals rejected including nested/exponent overflow',()=>{
  for(const input of ['{"id":90071992547409931234}','{"x":{"id":9007199254740993}}','{"x":[1e400]}']) assert.throws(()=>json(input),/quote large integers/);
  assert.equal(json('{"id":"90071992547409931234"}'),'id\n90071992547409931234');
});
test('BOM JSON accepted',()=>assert.equal(json('\uFEFF{"a":1}'),'a\n1'));
test('large practical dataset preserves 20,000 rows',()=>{
  const input='id,name\n'+Array.from({length:20000},(_,i)=>`${90071992547409931234n+BigInt(i)},Ali`).join('\n');
  assert.equal(json(csv(input)),input);
});
test('bounds reject excessive input and sparse rectangular expansion',()=>{
  assert.throws(()=>csv('a'.repeat(MAX_CONVERSION_BYTES+1)),/5 MiB/);
  const data=Array.from({length:1100},(_,i)=>({['key'+i]:i}));
  assert.throws(()=>json(JSON.stringify(data)),/cell table limit/);
});
test('UTF-8 CSV TSV JSON files, BOM and selected delimiter',async()=>{
  for(const [name,text,direction] of [['a.csv','\uFEFFname;age\nعلی;25','csv-to-json'],['a.tsv','name\tage\nAli\t25','csv-to-json'],['a.json','\uFEFF{"name":"علی"}','json-to-csv']] as const){
    const result=await readConversionFile(new File([text],name),direction);
    assert.equal(result.text,text.replace(/^\uFEFF/,''));
    assert.equal(result.delimiter,name.endsWith('.tsv')?'\t':undefined);
  }
});
test('file errors are clear for extension size decoding and read failure',async()=>{
  await assert.rejects(readConversionFile(new File(['x'],'x.txt'),'csv-to-json'),/Choose/);
  await assert.rejects(readConversionFile(new File([new Uint8Array([255])],'x.csv'),'csv-to-json'),/UTF-8/);
  await assert.rejects(readConversionFile({name:'x.csv',size:MAX_CONVERSION_BYTES+1} as File,'csv-to-json'),/5 MiB/);
  await assert.rejects(readConversionFile({name:'x.csv',size:1,arrayBuffer:async()=>{throw Error('private path');}} as File,'csv-to-json'),/Cannot read file/);
});
