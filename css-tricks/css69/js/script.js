      const POSTERS_PER_ROW = 12;
      const RING_RADIUS = 200;

      function setup_posters (row)
      {
        var posterAngle = 360 / POSTERS_PER_ROW;
        for (var i = 0; i < POSTERS_PER_ROW; i ++) {
          var poster = document.createElement('div');
          poster.className = 'poster';
          // compute and assign the transform for this poster
          var transform = 'rotateY(' + (posterAngle * i) + 'deg) translateZ(' + RING_RADIUS + 'px)';
          poster.style.webkitTransform = transform;
          // setup the number to show inside the poster
          var content = poster.appendChild(document.createElement('p'));
          content.textContent = i;
          // add the poster to the row
          row.appendChild(poster);
        }

      }

      function init ()
      {
        setup_posters(document.getElementById('ring-1'));
        setup_posters(document.getElementById('ring-2'));
        setup_posters(document.getElementById('ring-3'));
      }

      // call init once the document is fully loaded
      window.addEventListener('load', init, false);