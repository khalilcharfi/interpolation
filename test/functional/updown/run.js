
var path = require('path'),
    sqlite3 = require('../sqlite3'),
    action = require('../action');

var paths = {
  reports: path.resolve( __dirname, './reports/' ),
  fixture: {
    oa: path.resolve( __dirname, './oa.csv' ),
    polyline: path.resolve( __dirname, './osm.polylines' )
  },
  db: {
    address: path.resolve( __dirname, './address.db' ),
    street: path.resolve( __dirname, './street.db' )
  }
};

module.exports.functional = {};

// import data
module.exports.functional.import = function(test) {
  action.import(test, paths);
};

// perform conflation
module.exports.functional.conflate = function(test) {
  action.conflate(test, paths);
};

// check table schemas
module.exports.functional.schema = function(test) {
  action.check.schema(test, paths);
};

// check table indexes
module.exports.functional.indexes = function(test) {
  action.check.indexes(test, paths);
};

module.exports.functional.street_counts = function(test) {
  test('street db table counts', function(t) {

    // count polyline table
    var polylines = sqlite3.count( paths.db.street, 'polyline' );
    t.equal(polylines, 44, 'count(polyline)');

    // count names table
    var names = sqlite3.count( paths.db.street, 'names' );
    t.equal(names, 44, 'count(names)');

    // count rtree table
    var rtree = sqlite3.count( paths.db.street, 'rtree' );
    t.equal(rtree, 44, 'count(rtree)');

    t.end();
  });
};

module.exports.functional.address_counts = function(test) {
  test('address db table counts', function(t) {

    // count address table
    var addresses = sqlite3.count( paths.db.address, 'address' );
    t.equal(addresses, 152, 'count(address)');

    t.end();
  });
};

module.exports.functional.spotcheck = function(test) {
  test('spot checks', function(t) {

    // counts for a specific street
    var count1 = sqlite3.count( paths.db.address, 'address', 'WHERE id=17' );
    t.equal(count1, 152);

    // counts for a specific street (open addresses)
    var count2 = sqlite3.count( paths.db.address, 'address', 'WHERE id=17 AND source="OA"' );
    t.equal(count2, 140);

    // counts for a specific street (vertexes)
    var count3 = sqlite3.count( paths.db.address, 'address', 'WHERE id=17 AND source="VERTEX"' );
    t.equal(count3, 12);

    t.end();
  });
};

// @todo: some of these vertex values seem to be wrong
module.exports.functional.end_to_end = function(test) {
  test('end to end', function(t) {

    // full interpolation for a single street
    var rows = sqlite3.exec( paths.db.address, 'SELECT * FROM address WHERE id=17 ORDER BY housenumber' );
    t.deepEqual(rows, [
      '116|17|OA|1.0|52.5181593|13.4540245|R|52.5183595|13.4541264',
      '1|17|OA|1.1|52.5181676|13.4541247|R|52.518343|13.454214',
      '141|17|VERTEX|1.809||||52.51831|13.454389',
      '117|17|OA|2.0|52.5181761|13.4543727|R|52.5183012|13.4544361',
      '118|17|OA|3.0|52.5181347|13.454604|R|52.5182579|13.4546665',
      '2|17|OA|4.0|52.5180874|13.4548722|R|52.5182079|13.4549333',
      '3|17|OA|5.0|52.5180369|13.4551583|R|52.5181545|13.4552179',
      '110|17|OA|6.0|52.5179866|13.4554435|R|52.5181012|13.4555016',
      '127|17|OA|7.0|52.517957|13.4556096|R|52.5180702|13.455667',
      '119|17|OA|8.0|52.5179136|13.4558537|R|52.5180246|13.4559099',
      '120|17|OA|9.0|52.5178602|13.4561472|R|52.5179696|13.4562027',
      '4|17|OA|10.0|52.5178143|13.4564022|R|52.517922|13.4564568',
      '142|17|VERTEX|11.499||||52.517799|13.457112',
      '5|17|OA|12.0|52.5176578|13.4572844|R|52.517761|13.4573324',
      '6|17|OA|13.0|52.5176184|13.4575043|R|52.5177231|13.457553',
      '7|17|OA|14.0|52.517569|13.4577793|R|52.5176756|13.4578289',
      '121|17|OA|15.0|52.5175284|13.4580058|R|52.5176364|13.458056',
      '122|17|OA|16.0|52.5174873|13.4582345|R|52.5175969|13.4582855',
      '123|17|OA|16.1|52.5167765|13.4575346|R|52.5176558|13.4579435',
      '8|17|OA|17.0|52.5174483|13.4584525|R|52.5175592|13.4585041',
      '128|17|OA|17.1|52.517189|13.4582929|R|52.5175654|13.4584681',
      '129|17|OA|17.2|52.5171445|13.4582422|R|52.5175702|13.4584404',
      '130|17|OA|17.3|52.5171001|13.4581954|R|52.5175744|13.4584162',
      '131|17|OA|18.0|52.5173993|13.458721|R|52.5175127|13.4587738',
      '133|17|OA|18.1|52.5171691|13.4586768|R|52.5175027|13.4588321',
      '134|17|OA|18.2|52.5169644|13.4589145|R|52.5174496|13.4591402',
      '144|17|VERTEX|18.293||||52.517456|13.459103',
      '135|17|OA|18.3|52.5168482|13.4588171|R|52.5174565|13.4591002',
      '136|17|OA|18.4|52.5168882|13.4585878|R|52.517496|13.4588707',
      '137|17|OA|18.5|52.5169547|13.4582482|R|52.5175552|13.4585277',
      '138|17|OA|18.6|52.516766|13.4581569|R|52.5175557|13.4585245',
      '139|17|OA|18.7|52.516661|13.4584243|R|52.5175052|13.4588173',
      '140|17|OA|18.8|52.516584|13.4586361|R|52.5174657|13.4590465',
      '124|17|OA|19.0|52.5173805|13.4588312|R|52.5174938|13.4588839',
      '9|17|OA|20.0|52.5173306|13.45911|R|52.5174456|13.4591635',
      '10|17|OA|21.0|52.5172902|13.4593359|R|52.5174066|13.45939',
      '111|17|OA|22.0|52.5171656|13.460029|R|52.5172855|13.4600896',
      '11|17|OA|23.0|52.5170485|13.4606884|R|52.5171627|13.4607461',
      '12|17|OA|24.0|52.5169075|13.4614761|R|52.5170193|13.4615302',
      '13|17|OA|25.0|52.5168569|13.4617594|R|52.5169686|13.4618134',
      '14|17|OA|26.0|52.5168108|13.4620177|R|52.5169223|13.4620717',
      '15|17|OA|27.0|52.5167475|13.4623445|R|52.5168634|13.4624006',
      '16|17|OA|28.0|52.5167077|13.4625941|R|52.5168191|13.462648',
      '17|17|OA|28.1|52.5166738|13.4627835|R|52.5167852|13.4628374',
      '18|17|OA|29.0|52.5165588|13.4630663|R|52.5167295|13.4631485',
      '125|17|OA|29.1|52.5164395|13.4629701|R|52.5167359|13.4631128',
      '19|17|OA|29.2|52.5163032|13.4628419|R|52.516746|13.463056',
      '20|17|OA|29.3|52.5161271|13.4626856|R|52.5167577|13.4629907',
      '21|17|OA|29.4|52.5160097|13.4625879|R|52.5167644|13.462953',
      '126|17|OA|29.5|52.5158453|13.4624351|R|52.5167765|13.4628856',
      '22|17|OA|29.6|52.5162804|13.4622531|R|52.5168412|13.4625244',
      '23|17|OA|30.0|52.5165559|13.4634424|R|52.5166675|13.4634961',
      '24|17|OA|31.0|52.5164525|13.464026|R|52.5165606|13.4640807',
      '25|17|OA|32.0|52.5164032|13.4643039|R|52.5165087|13.4643573',
      '26|17|OA|33.0|52.5163544|13.4645794|R|52.5164574|13.4646315',
      '147|17|VERTEX|34.237||||52.516357|13.465167',
      '27|17|OA|35.0|52.5161954|13.4654536|R|52.5163023|13.4655009',
      '28|17|OA|36.0|52.516017|13.4660726|R|52.5161928|13.4661592',
      '29|17|OA|37.0|52.516017|13.4660726|R|52.5161928|13.4661592',
      '149|17|VERTEX|37.618||||52.516208|13.466076',
      '30|17|OA|38.0|52.516017|13.4660726|R|52.5161928|13.4661592',
      '31|17|OA|39.0|52.5159796|13.4666581|R|52.5160917|13.4667133',
      '115|17|OA|40.0|52.5159286|13.4669414|R|52.5160401|13.4669963',
      '32|17|OA|41.0|52.5158811|13.4672077|R|52.5159923|13.4672614',
      '33|17|OA|42.0|52.5158214|13.4675383|R|52.5159331|13.4675922',
      '34|17|OA|42.1|52.5157811|13.4677659|R|52.5158925|13.4678197',
      '150|17|VERTEX|42.671||||52.515834|13.468147',
      '35|17|OA|43.0|52.5156695|13.4682736|R|52.5158009|13.4683358',
      '151|17|VERTEX|43.076||||52.515739|13.468689',
      '36|17|OA|43.1|52.5156069|13.4687447|R|52.5157193|13.468799',
      '37|17|OA|44.0|52.5155336|13.469152|R|52.5156465|13.4692065',
      '38|17|OA|44.1|52.5154846|13.4694316|R|52.5155965|13.4694857',
      '39|17|OA|45.0|52.5154389|13.4696803|R|52.515552|13.4697349',
      '40|17|OA|46.0|52.5153989|13.4699064|R|52.5155116|13.4699608',
      '41|17|OA|47.0|52.5153586|13.4701335|R|52.515471|13.4701878',
      '152|17|VERTEX|47.034||||52.515457|13.470266',
      '112|17|OA|47.1|52.5150335|13.4702293|R|52.5154303|13.4704178',
      '113|17|OA|47.2|52.5149156|13.4695999|R|52.5155236|13.4698935',
      '42|17|OA|48.0|52.5153133|13.470389|R|52.515426|13.4704425',
      '43|17|OA|49.0|52.5152812|13.470569|R|52.5153943|13.4706227',
      '44|17|OA|50.0|52.5152347|13.4708324|R|52.5153479|13.4708862',
      '45|17|OA|51.0|52.515196|13.4710486|R|52.5153098|13.4711027',
      '46|17|OA|52.0|52.5151292|13.471422|R|52.5152441|13.4714766',
      '106|17|OA|53.0|52.5149274|13.4721436|R|52.515108|13.4722335',
      '107|17|OA|54.0|52.5148523|13.4725712|R|52.5150295|13.4726594',
      '47|17|OA|55.0|52.5145399|13.4741008|R|52.5146351|13.474177',
      '48|17|OA|55.1|52.5144751|13.4743328|R|52.514606|13.474275',
      '49|17|OA|55.2|52.515206|13.4740943|L|52.5147645|13.4737406',
      '50|17|OA|56.0|52.5148726|13.4738047|L|52.5147699|13.4737225',
      '51|17|OA|57.0|52.5153421|13.4715556|L|52.5152388|13.4715065',
      '52|17|OA|57.1|52.5154134|13.4711609|L|52.5153084|13.471111',
      '53|17|OA|57.2|52.5153736|13.47138|L|52.5152697|13.4713307',
      '54|17|OA|58.0|52.5154634|13.4708777|L|52.5153582|13.4708277',
      '55|17|OA|59.0|52.5157684|13.4707552|L|52.5154016|13.470581',
      '56|17|OA|59.1|52.5154901|13.4707282|L|52.5153845|13.4706781',
      '57|17|OA|60.0|52.5155516|13.4703847|L|52.515445|13.4703341',
      '58|17|OA|61.0|52.515593|13.4701532|L|52.5154864|13.4701017',
      '59|17|OA|62.0|52.5156392|13.4698946|L|52.5155326|13.4698431',
      '60|17|OA|63.0|52.5156788|13.4696736|L|52.5155721|13.4696221',
      '61|17|OA|64.0|52.5157277|13.4693999|L|52.5156211|13.4693484',
      '62|17|OA|65.0|52.5157705|13.4691608|L|52.5156638|13.4691093',
      '63|17|OA|66.0|52.515816|13.4689061|L|52.5157094|13.4688546',
      '132|17|OA|67.0|52.5158922|13.4685241|L|52.5157774|13.4684698',
      '64|17|OA|68.0|52.5160258|13.4677331|L|52.5159173|13.4676808',
      '65|17|OA|69.0|52.5160696|13.4674885|L|52.515961|13.4674361',
      '66|17|OA|70.0|52.516116|13.467229|L|52.5160074|13.4671766',
      '67|17|OA|71.0|52.5161499|13.4670386|L|52.5160421|13.4669855',
      '68|17|OA|72.0|52.5162049|13.4667313|L|52.5160981|13.4666787',
      '108|17|OA|73.0|52.5162842|13.466287|L|52.516179|13.4662352',
      '148|17|VERTEX|73.06||||52.516208|13.466076',
      '109|17|OA|73.1|52.5165173|13.4661|L|52.5162253|13.4659707',
      '69|17|OA|74.0|52.5163624|13.4658505|L|52.5162529|13.465802',
      '70|17|OA|75.0|52.5164191|13.4655338|L|52.5163051|13.4654834',
      '71|17|OA|76.0|52.5165578|13.4647574|L|52.5164445|13.4647001',
      '72|17|OA|77.0|52.5166147|13.4644387|L|52.516504|13.4643827',
      '73|17|OA|78.0|52.5166626|13.4641712|L|52.5165539|13.4641162',
      '74|17|OA|79.0|52.5167132|13.463888|L|52.5166068|13.4638341',
      '75|17|OA|80.0|52.5167486|13.4636904|L|52.516642|13.4636391',
      '76|17|OA|81.0|52.5169269|13.4628164|L|52.5167999|13.462755',
      '146|17|VERTEX|81.319||||52.516746|13.463056',
      '77|17|OA|82.0|52.5169269|13.4628164|L|52.5167999|13.462755',
      '78|17|OA|83.0|52.5170609|13.4619433|L|52.5169545|13.4618919',
      '79|17|OA|84.0|52.5171159|13.4616362|L|52.5170096|13.4615848',
      '80|17|OA|85.0|52.5172819|13.4607036|L|52.5171803|13.4606523',
      '81|17|OA|86.0|52.5173283|13.4604445|L|52.5172286|13.4603941',
      '82|17|OA|87.0|52.5174437|13.4602366|L|52.5172741|13.4601509',
      '145|17|VERTEX|87.052||||52.517292|13.460055',
      '83|17|OA|87.1|52.5174779|13.4600433|L|52.5173077|13.4599641',
      '84|17|OA|88.0|52.5175184|13.4598173|L|52.5173467|13.4597374',
      '114|17|OA|89.0|52.517556|13.459598|L|52.5173845|13.4595182',
      '85|17|OA|90.0|52.5175417|13.4593857|L|52.5174173|13.4593278',
      '86|17|OA|91.0|52.5176381|13.4588339|L|52.5175125|13.4587754',
      '87|17|OA|92.0|52.5177289|13.4586781|L|52.5175441|13.4585921',
      '88|17|OA|92.1|52.51776|13.4585037|L|52.5175742|13.4584172',
      '143|17|VERTEX|92.897||||52.517612|13.458198',
      '89|17|OA|93.0|52.517726|13.4582205|L|52.5176169|13.4581698',
      '90|17|OA|94.0|52.517772|13.4579617|L|52.5176615|13.4579103',
      '91|17|OA|95.0|52.5178095|13.4577507|L|52.517698|13.4576988',
      '92|17|OA|96.0|52.5178569|13.4574837|L|52.517744|13.4574312',
      '93|17|OA|97.0|52.5179713|13.4568436|L|52.51786|13.4567872',
      '94|17|OA|98.0|52.5180285|13.4565344|L|52.5179179|13.4564784',
      '95|17|OA|99.0|52.518077|13.4562624|L|52.5179687|13.4562075',
      '96|17|OA|100.0|52.5181116|13.4560686|L|52.5180049|13.4560145',
      '97|17|OA|100.1|52.5181469|13.4558707|L|52.5180419|13.4558175',
      '98|17|OA|101.0|52.5181854|13.455654|L|52.5180824|13.4556018',
      '99|17|OA|102.0|52.5182277|13.4554156|L|52.5181269|13.4553645',
      '100|17|OA|103.0|52.5182638|13.4552124|L|52.5181649|13.4551623',
      '101|17|OA|104.0|52.5183037|13.4549883|L|52.5182068|13.4549392',
      '102|17|OA|105.0|52.5183429|13.4547691|L|52.5182477|13.4547209',
      '103|17|OA|106.0|52.5183872|13.4545219|L|52.5182939|13.4544746',
      '104|17|OA|107.0|52.5184935|13.454327|L|52.5183367|13.4542472',
      '105|17|OA|108.0|52.518488|13.4540511|L|52.5183837|13.453998'
    ]);

    t.end();
  });
};

// write geojson to disk
module.exports.functional.geojson = function(test) {
  action.geojson(test, paths, 'id=17');
};

// write tsv to disk
module.exports.functional.tsv = function(test) {
  action.tsv(test, paths, 'id=17');
};

module.exports.all = function (tape) {

  function test(name, testFunction) {
    return tape('functional: updown: ' + name, testFunction);
  }

  for( var testCase in module.exports.functional ){
    module.exports.functional[testCase](test);
  }
};
