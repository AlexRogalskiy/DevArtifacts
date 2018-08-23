var tnum = 'en';

$(document).ready(function(){
  
  $(document).click( function(e) {
       $('.translate_wrapper, .more_lang').removeClass('active');     
  });
  
  $('.translate_wrapper .current_lang').click(function(e){    
    e.stopPropagation();
    $(this).parent().toggleClass('active');
    
    setTimeout(function(){
      $('.more_lang').toggleClass('active');
    }, 5);
  });
  

  /*TRANSLATE*/
  translate(tnum);
  
  $('.more_lang .lang').click(function(){
    $(this).addClass('selected').siblings().removeClass('selected');
    $('.more_lang').removeClass('active');  
    
    var img = $(this).find('img').attr('src');    
    var lang = $(this).attr('data-value');
    var tnum = lang;
    translate(tnum);
    
    $('.current_lang .lang-txt').text(lang);
    $('.current_lang img').attr('src', img);
    
    if(lang == 'ar'){
      $('body').attr('dir', 'rtl');
    }else{
      $('body').attr('dir', 'ltr');
    }
    
  });
});

function translate(tnum){
  $('h1').text(trans[0][tnum]);
  $('p').text(trans[1][tnum]);
  $('.content a span').text(trans[2][tnum]);
}

var trans = [ 
  { 
    en : 'Chameleon',
    pt : 'Camaleão',
    es : 'Camaleón',
    fr : 'Caméléon',
    de : 'Chamäleon', 
    cn : '变色龙',
    ar : 'حرباء'
  },{ 
    en : 'For sheer breadth of freakish anatomical features, the chameleon has few rivals. A tongue far longer than its body, shooting out to snatch insects in a fraction of a second. Telescopic-vision eyes that swivel independently in domed turrets. Feet with toes fused into mitten-like pincers. Horns sprouting from brow and snout. Knobbly nasal ornaments. A skin flap circling the neck like a lace ruff on an Elizabethan noble.',
    pt : 'Por uma infinidade de características anatômicas, o camaleão tem poucos rivais. Uma língua muito mais longa do que o seu corpo, disparando para pegar insetos em uma fração de segundo. Olhos de visão telescópica que giram de forma independente em torres com abóbadas. Pés com os dedos fundidos em pinças tipo luva. Chifres brotando da sobrancelha e do focinho. Ornamentos nasais knobbly. Uma aba de pele que circunda o pescoço como uma barriga de renda em um nobre isabelino.',
    es : 'Por pura amplitud de extrañas características anatómicas, el camaleón tiene pocos rivales. Una lengua mucho más larga que su cuerpo, disparando para atrapar insectos en una fracción de segundo. Ojos de visión telescópica que giran independientemente en las torretas abovedadas. Pies con dedos de los pies fusionados en pinzas tipo mitones. Cuernos que brotan de la frente y el hocico. Adornos nasales nudosos. Una aleta de piel que rodea el cuello como una puntilla de encaje sobre un noble isabelino.',
    fr: "Pour l'ampleur pure des caractéristiques anatomiques bizarres, le caméléon a peu de rivaux. Une langue bien plus longue que son corps, tirant pour arracher les insectes en une fraction de seconde. Yeux à vision télescopique pivotant indépendamment dans des tourelles à dôme. Pieds avec les orteils fondus dans des tenailles mitaines. Cornes qui poussent du front et du museau. Ornements nasaux Knobbly. Un lambeau de peau entourant le cou comme une collerette de dentelle sur un noble élisabéthain.",
    de: 'Wegen der schieren Breite der anatomischen Besonderheiten hat das Chamäleon wenige Rivalen. Eine Zunge, die viel länger ist als ihr Körper und in einem Bruchteil einer Sekunde Insekten erjagt. Teleskopische Augen, die unabhängig voneinander in Kuppeltürmen schwenken. Füße mit Zehen verschmolzen zu handschuhartigen Zangen. Hörner sprießen von der Stirn und der Schnauze. Knoblige Nasenverzierungen. Ein Hautlappen umkreist den Hals wie ein Spitzenkragen an einem elisabethanischen Adligen.',
    cn: '由于极其奇特的解剖特征，变色龙几乎没有对手。一只比它的身体长得多的舌头，在几分之一秒内射出来抓住昆虫。在圆顶炮塔中独立旋转的望远镜视力眼睛。脚趾融合成中爪状的钳子。喇叭从眉头和鼻子发芽。棘手的鼻饰。在伊丽莎白的优雅的伊丽莎白时代，像皮带一样绕着脖子的皮瓣',
    ar : 'لمجرد اتساع الميزات التشريحية فظيع، والحرباء لديها منافسيه قليلة. اللسان أطول بكثير من جسمه، واطلاق النار لانتزاع الحشرات في جزء صغير من الثانية. عيون الرؤية تلسكوبية التي قطب بشكل مستقل في الأبراج القبة. قدم مع أصابع تنصهر في وسط-- مثل بينكرز. هورنز، تبرعم، من، الحواجب، أيضا، سنوت. نوبل الحلي الأنفية. جلد رفرف تحلق الرقبة مثل الرباط روف على إليزابيثية أنيقة.'
  },{ 
    en : 'See More',
    pt : 'Saiba mais',
    es : 'Más información',
    fr : 'En savoir plus',
    de : 'Weitere Infos',
    cn : '查看更多',
    ar : 'مشاهدة المزيد'
  },
  
];
