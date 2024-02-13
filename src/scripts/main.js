ymaps.ready(init);
function init(){
    // Создание карты.
    var myMap = new ymaps.Map("contacts-map", {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [55.765331, 37.629125],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 14,
        controls: [],
    });

    var myPlacemark = new ymaps.Placemark([55.769535, 37.639985], {}, {
      iconLayout: 'default#image',
      iconImageHref: 'img/location.png',
      iconImageSize: [12, 12],
      iconImageOffeset: [-3, -42],
    });

    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable(['drag', 'rightMouseButtonMagnifier', 'scrollZoom'])
  };
