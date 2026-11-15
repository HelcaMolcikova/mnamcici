/* Veřejná knihovna receptů a témat. Osobní deník se sem neexportuje. */
globalThis.PRIKRMY_KNIHOVNA = (() => {
  const nhs='https://www.nhs.uk/best-start-in-life/baby/weaning/what-to-feed-your-baby/from-around-6-months/';
  const allergy='https://www.nhs.uk/baby/weaning-and-feeding/food-allergies-in-babies-and-young-children/';
  const ig='https://www.instagram.com/varime_mrnouskum/';
  const foods=[
    ['dyne','Máslová dýně'],['hokkaido','Dýně hokkaido'],['hruska','Hruška'],['jablko','Jablko'],
    ['batat','Batát'],['brokolice','Brokolice'],['cuketa','Cuketa'],['mrkev','Mrkev'],['brambor','Brambory'],
    ['kure','Kuřecí maso','','Lednice'],['hovezi','Hovězí maso','','Lednice'],['ryze','Rýže','','Trvanlivé'],['cocka','Čočka','','Trvanlivé'],
    ['vejce','Vejce','Vejce','Lednice'],['jogurt','Bílý jogurt','Mléko','Lednice'],['mleko','Mléko','Mléko','Lednice'],
    ['psenice','Pšenice','Lepek','Trvanlivé'],['vlocky','Ovesné vločky','Lepek','Trvanlivé'],['ryba','Ryba','Ryby','Lednice'],
    ['arasid','Arašídy','Arašídy','Trvanlivé'],['mandle','Mandle','Skořápkové plody','Trvanlivé'],['sezam','Sezam','Sezam','Trvanlivé'],
    ['soja','Sója','Sója','Trvanlivé'],['celer','Celer','Celer'],['horcice','Hořčice','Hořčice','Doma'],
    ['petrzelkoren','Petržel (kořen)'],['petrzel','Petrželová nať'],['cesnek','Česnek'],['cibule','Cibule nebo šalotka'],
    ['krupicka','Pšeničná krupička','Pšenice (lepek)','Trvanlivé'],['kuskus','Kuskus','Pšenice (lepek)','Trvanlivé'],
    ['bulgur','Bulgur','Pšenice (lepek)','Trvanlivé'],['testoviny','Pšeničné těstoviny','Pšenice (lepek), případně vejce dle obalu','Trvanlivé'],
    ['maslo','Máslo','Mléko','Lednice'],['olej','Olivový olej','','Doma'],['cizrna','Cizrna','','Trvanlivé'],
    ['spenat','Špenát'],['formula','Kojenecké mléko (hotové dle návodu)','Mléko dle složení výrobku','Trvanlivé'],
    ['banan','Banán'],['maliny','Maliny'],['skorice','Skořice','','Doma'],['kapusta','Kapusta'],
    ['mouka-spaldova','Špaldová mouka','Pšenice (lepek)','Trvanlivé'],['kmin','Kmín','','Doma'],['majoranka','Majoránka','','Doma'],
    ['paprika','Paprika (zelenina)'],['rajcata','Rajčata'],['bazalka','Bazalka','','Doma'],
    ['hrasek','Hrášek'],['smetana','Smetana','Mléko','Lednice'],['syr','Pasterovaný sýr','Mléko','Lednice'],
    ['muskat','Muškátový oříšek','','Doma']
  ].map(([id,name,allergen='',group='Ovoce a zelenina'])=>({id,name,allergen,group}));
  const purees=[
    ['dyne-hruska','Máslová dýně s hruškou',['dyne','hruska'] ,'fotky/prikrm-dyne-hruska.png'],
    ['hokkaido-jablko','Hokkaido s jablkem',['hokkaido','jablko'] ,'fotky/prikrm-hokkaido-jablko.png'],
    ['batat-jablko','Batát s jablkem',['batat','jablko'] ,'fotky/prikrm-batat-jablko.png'],
    ['brokolice-hruska','Brokolice s hruškou',['brokolice','hruska'] ,'fotky/prikrm-brokolice-hruska.png'],
    ['cuketa-hruska','Cuketa s hruškou',['cuketa','hruska'],''],
    ['mrkev-jablko','Mrkev s jablkem',['mrkev','jablko'] ,'fotky/prikrm-mrkev-jablko.png']
  ].map(([id,name,ids,photo])=>({id,name,foods:ids,photo,minMonths:6,ageSource:'Orientačně od ukončených 6 měsíců podle složení a doporučení NHS.',ageUrl:nhs,category:'Pyré',sourceLabel:'Vlastní tip Mňamčíků',sourceUrl:'',ingredients:ids.map(id=>foods.find(f=>f.id===id).name+' - podle velikosti chystané dávky'),steps:['Zeleninu očisti; máslovou dýni, batát a mrkev oloupej. U dýně odstraň semena.','Zeleninu uvař úplně doměkka. Hrušku nebo jablko oloupej, zbav jádřince a podle tvrdosti podus.','Spoj přibližně dva díly zeleniny s jedním dílem ovoce. Rozmačkej nebo rozmixuj a podle potřeby zřeď vodou.'],notes:['Bez přidané soli a cukru. Velikost porce přizpůsob chuti dítěte.','Pro další den odlož samostatnou nedotčenou porci; zbytky z podané misky neuchovávej.']}));
  const sourced=[
    {
      id:'polevka-krupicka-ryze-vejce',name:'Polévka s krupičkou, rýží a vejcem',category:'Polévka',minMonths:6,
      ageSource:'Autorka uvádí přibližně od 6 měsíců podle připravenosti.',
      sourceUrl:'https://www.instagram.com/p/DfXVvOys8CU/',
      photo:'fotky/prikrmy-instagram/polevka-krupicka-ryze-vejce.jpg',
      foods:['mrkev','petrzelkoren','celer','cesnek','krupicka','ryze','maslo','vejce','petrzel'],
      ingredients:['2 mrkve','1 kořen petržele','100 g celeru','1 stroužek česneku','2 lžíce krupičky','2 lžíce rýže','kousek másla','1 l vody','1 vejce','petrželová nať'],
      steps:['Kořenovou zeleninu jemně pokrájej nebo nastrouhej. Krátce ji prohřej na másle s česnekem a krupičkou.','Přidej vodu a propláchnutou rýži. Vař, až budou obě složky zcela měkké.','Za míchání přilij rozšlehané vejce a důkladně provař. Nakonec přidej jemnou petrželku.'],
      notes:['Dětskou porci nesol a konzistenci uprav podle dovedností. Obsahuje více alergenů; k prvnímu zavedení všech současně se nehodí.','Kvůli rýži platí spotřeba do 24 hodin od jejího uvaření, nikoli automaticky až do večera druhého dne.']
    },
    {
      id:'cizrna-spenat-vejce',name:'Cizrna se špenátem, bramborem a vejcem',category:'Pyré',minMonths:6,
      ageSource:'Ve zdroji „od 7. měsíce“, tedy po ukončeném 6. měsíci. Nejde o údaj „od ukončeného 7. měsíce“.',
      sourceUrl:'https://www.instagram.com/reel/De8sJLnMcFV/',
      photo:'fotky/prikrmy-instagram/cizrna-spenat-vejce.jpg',
      foods:['cizrna','spenat','brambor','vejce','maslo','formula'],
      ingredients:['2 špalíčky mraženého špenátu','100 g brambor','2 lžíce předvařené propláchnuté cizrny','1 vejce','kousek másla','voda na vaření','hotové kojenecké mléko - autorka používá množství ze 3 odměrek, vždy s vodou dle obalu'],
      steps:['Brambory, špenát a cizrnu uvař ve vodě do úplného změknutí.','Vmíchej vejce a pokračuj ve vaření, dokud nezůstane syrový bílek ani žloutek. Přidej máslo a uprav konzistenci.','Mléko připrav samostatně přesně podle návodu a vmíchej až do jedné porce určené k podání.'],
      servingNote:'Na další den či do mrazáku odlož pouze základ bez kojeneckého mléka. Hotové mléko přidej až do podávané porce; tu už neuchovávej.',
      notes:['Dávku prášku neměň vůči množství vody uvedenému výrobcem. Vejce a používané mléko zaváděj nejprve jednotlivě.','Oddělení mléka až při podávání je naše úprava pro dvoudenní přípravu. Pokud použiješ jiné mléko nebo ho vynecháš, oprav složení zápisu.']
    },
    {
      id:'kure-cocka-kuskus',name:'Kuřecí s čočkou, kuskusem a zeleninou',category:'Hlavní jídlo',minMonths:6,
      ageSource:'Ve zdroji „od 7. měsíce“, přepočteno na ukončených 6 měsíců.',
      sourceUrl:'https://www.instagram.com/reel/DesC-iWsDBx/',
      photo:'fotky/prikrmy-instagram/kure-cocka-kuskus.jpg',
      foods:['kure','cuketa','cocka','kuskus','mrkev','olej'],
      ingredients:['70 g kuřecího masa','30 g cukety','2 lžíce červené čočky','2 lžíce kuskusu','hrst baby mrkve','1 l vody ve zdrojovém receptu - skutečné množství přizpůsob konzistenci','1 lžička olivového oleje'],
      steps:['Nakrájené maso, zeleninu, propláchnutou čočku a kuskus vlož do hrnce s vodou.','Pod pokličkou vař přibližně 30 minut; maso musí být úplně hotové a zelenina s čočkou měkké.','Před mixováním podle potřeby odlož část tekutiny. Rozmixuj, vmíchej olej a uprav hustotu.'],
      notes:['Kuskus obsahuje pšenici. Celý hrnec není doporučená porce pro miminko.','Množství vody uvádí autorka na celý recept. Přizpůsobení hustoty je naše praktické doplnění. Přebytky rychle zchlaď a rozděl.']
    },
    {
      id:'ovesna-kase-zloutek',name:'Ovesná kaše s ovocem a žloutkem',category:'Kaše',minMonths:7,
      ageSource:'Autorka výslovně uvádí od ukončeného 7. měsíce.',
      sourceUrl:'https://www.instagram.com/reel/De07J7xM23m/',
      photo:'fotky/prikrmy-instagram/ovesna-kase-zloutek.jpg',
      foods:['vlocky','mleko','maliny','banan','skorice','vejce'],
      ingredients:['¼ hrnku ovesných vloček','1 hrnek mléka','hrstička malin','½ banánu','špetka skořice','1 žloutek','volitelně lžíce bílého jogurtu až při podávání'],
      steps:['Vločky dej do hrnce s mlékem, malinami, rozmačkaným banánem, skořicí a žloutkem.','Míchej a vař do změknutí vloček a úplného provaření žloutku.','Nech zchladnout. Volitelný jogurt přidej až do podávané porce.'],
      servingNote:'Jogurt přidej případně až do podávané porce a doplň ho do skutečného složení deníku.',
      notes:['Zdroj uvádí 2-3 menší porce, ne jednu. Žloutek se v přehledu alergenů počítá jako vejce.','Pro vaření lze použít pasterované plnotučné kravské mléko; před 12 měsíci nenahrazuje hlavní mléčný nápoj.']
    },
    {
      id:'zeleninova-polevka-cizrna',name:'Zeleninová polévka s cizrnou',category:'Polévka',minMonths:8,
      ageSource:'Autorka uvádí přibližně 8-9 měsíců podle zvládání konzistence. Filtr používá dolní hranici 8.',
      sourceUrl:'https://www.instagram.com/reel/DekRuZfs-rT/',
      photo:'fotky/prikrmy-instagram/zeleninova-polevka-cizrna.jpg',
      foods:['mrkev','petrzelkoren','celer','brambor','cizrna','kapusta','cibule','cesnek','maslo','mouka-spaldova','kmin','majoranka'],
      ingredients:['130 g mrkve','45 g kořenové petržele','100 g celeru','300 g brambor','130 g předvařené cizrny','kapusta a cibule - množství neuvedeno','3 stroužky česneku','20 g másla','20 g hladké špaldové mouky','1,5 l vody','drcený kmín a majoránka'],
      steps:['Kořenovou zeleninu pokrájej a krátce prohřej na másle. Přidej ostatní zeleninu, propláchnutou cizrnu, kmín a vodu.','Vař doměkka. Přilij mouku rozmíchanou ve studené vodě a ještě nejméně 10 minut provař.','Dochuť majoránkou. Cizrnu rozmáčkni a podle potřeby část polévky rozmixuj.'],
      notes:['Bez přidané soli. Suroviny jsou na celý hrnec; dítěti nabídni malé množství podle chuti.','Špalda je druh pšenice a obsahuje lepek.']
    },
    {
      id:'bulgur-zelenina-kure',name:'Bulgur se zeleninou a kuřecím',category:'Hlavní jídlo',minMonths:8,
      ageSource:'Autorka uvádí přibližně 8-9 měsíců podle dovedností. Filtr používá dolní hranici 8.',
      sourceUrl:'https://www.instagram.com/reel/DePnlvBsEXs/',
      photo:'fotky/prikrmy-instagram/bulgur-zelenina-kure.jpg',
      foods:['kure','cibule','cesnek','paprika','mrkev','rajcata','bulgur','bazalka','majoranka','olej'],
      ingredients:['1 kuřecí prso','1 cibule','2 stroužky česneku','1 zelená paprika','1 větší mrkev','1 plechovka sekaných rajčat','½ hrnku bulguru','bazalka a majoránka','olej a voda podle potřeby'],
      steps:['Na oleji krátce prohřej drobně nakrájenou cibuli s česnekem a přidej malé kousky masa s bylinkami.','Přidej zeleninu a rajčata, podlij a dus, až bude maso důkladně hotové a zelenina měkká.','Bulgur uvař zvlášť podle obalu a promíchej se směsí. Přizpůsob velikost kousků.'],
      notes:['Tato dětská varianta je bez medu a přidané soli. Med nepatří dětem před 12 měsíci.','Autorka zmiňuje i kachní maso a dochucení pro starší; zde je základní kuřecí varianta. Bulgur obsahuje pšenici.']
    },
    {
      id:'testoviny-cuketa-hrasek-kure',name:'Těstoviny s cuketou, hráškem a kuřecím',category:'Hlavní jídlo',minMonths:9,
      ageSource:'Autorka uvádí přibližně od 9 měsíců podle zvládání měkkých kousků.',
      sourceUrl:'https://www.instagram.com/reel/Ddza6qbMf0N/',
      photo:'fotky/prikrmy-instagram/testoviny-cuketa-hrasek-kure.jpg',
      foods:['kure','cibule','cesnek','cuketa','hrasek','smetana','syr','muskat','testoviny'],
      ingredients:['1 kuřecí prso','1 menší šalotka','1-2 stroužky česneku','200 g mladé cukety','3 lžíce mraženého nebo propláchnutého sterilovaného hrášku','1 kelímek smetany','hrst strouhaného pasterovaného sýra','těstoviny - množství neuvedeno','špetka muškátového oříšku','trocha vody; případně bezsolné bylinky'],
      steps:['Drobnou šalotku a česnek krátce prohřej, přidej malé kousky masa a nech je zatáhnout.','Přidej cuketu, rozmáčknutý hrášek, smetanu a trochu vody. Dovař, aby bylo maso úplně hotové a zelenina měkká.','Vmíchej sýr s muškátem a spoj s uvařenými těstovinami.'],
      notes:['Hrášek nezůstává kulatý; maso i těstoviny uprav podle dovedností dítěte. Zkontroluj sůl v sýru a směsi koření.','Zvol pasterované mléčné výrobky. U těstovin ověř také případný obsah vajec.']
    }
  ].map(r=>({...r,photoCaption:'Náhled původního Reelu. Video otevřeš přes odkaz na zdroj.',sourceLabel:'Vaříme mrňouskům - Kateřina Nádvorníková',ageUrl:r.sourceUrl}));
  const guide=[
    {number:1,title:'Jeden druh zeleniny',foods:['brokolice','cuketa','mrkev','dyne','hokkaido','batat'],source:'Začátek jednodruhovou zeleninou.',practice:'Nabídni malé množství měkké zeleniny v konzistenci, kterou zvládá. Do deníku zapiš skutečnou ochutnávku.'},
    {number:2,title:'Kombinace zeleniny',foods:['brokolice','cuketa','mrkev','dyne','hokkaido','batat'],source:'Spojování již vyzkoušených druhů.',practice:'Kombinuj známé suroviny. Odmítnutí chuti eviduj zvlášť od zdravotního příznaku.'},
    {number:3,title:'Maso',foods:['kure','hovezi'],source:'Doplnění masa k zelenině.',practice:'Maso musí být důkladně tepelně upravené a konzistence přizpůsobená dítěti. Přesné složení patří do zápisu.'},
    {number:4,title:'Ovoce',foods:['jablko','hruska','banan','maliny'],source:'Rozšiřování jídelníčku o ovoce.',practice:'Tvrdé ovoce změkči, odstraň jádřince a pecky. Pořadí této série není podmínkou pro nabídnutí ovoce.'},
    {number:5,title:'Potraviny obsahující lepek',foods:['psenice','krupicka','kuskus','bulgur','testoviny','vlocky'],source:'Malé množství potraviny s lepkem.',practice:'Nový alergen zkoušej jednotlivě v malém množství. U směsí a těstovin ověř skutečné složení na obalu.'},
    {number:6,title:'Vejce',foods:['vejce'],source:'Zařazování vajíčka.',practice:'V místních podmínkách vejce důkladně uvař. Žloutek i celé vejce se evidují v alergenu Vejce; samotný žloutek neprokazuje toleranci celého vejce.'},
    {number:7,title:'Ořechy a arašídy',foods:['arasid','mandle'],source:'Pouze jemně mleté nebo ořechové máslo.',practice:'Celé ořechy ani samotnou hustou lžíci másla nepodávej. Jemné hladké máslo vmíchej nebo tence rozetři; jednotlivé druhy ořechů sleduj samostatně.'},
    {number:8,title:'Ryby',foods:['ryba'],source:'Rozšíření jídelníčku o rybu.',practice:'Rybu důkladně uvař a pečlivě odstraň kosti. NHS ji řadí mezi potraviny zaváděné kolem 6 měsíců; není nutné čekat na dokončení předchozích sedmi témat.'},
    {number:9,title:'Mléčné výrobky',foods:['jogurt','mleko','syr'],source:'Dodatek z přehledu: jogurt, kefír a zakysané výrobky.',practice:'Pasterovaný plnotučný jogurt či sýr lze podle NHS nabízet kolem 6 měsíců. Kravské mléko lze použít v jídle, jako hlavní nápoj až od 12 měsíců.'}
  ];
  return {foods,recipes:[...purees,...sourced],guide,sources:{nhs,allergy,ig},checkedAt:'2026-11-15'};
})();
