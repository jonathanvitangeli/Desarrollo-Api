import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const Wheel = ({ randomNumber }) => {
  const wheelRef = useRef(null);
  const indicatorRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const numberOfSegments = 100;
    const data = Array(numberOfSegments).fill(1); // Cada segmento tiene el mismo tamaño
    const pieColor = Array(numberOfSegments).fill().map((_, index) => `hsl(${index * 360 / numberOfSegments}, 80%, 50%)`);

    // Etiquetas del gráfico del 1 al 100
    const labels = Array.from({ length: numberOfSegments }, (_, i) => (i + 1).toString());

    const myChart = new Chart(wheel, {
      plugins: [ChartDataLabels],
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: pieColor,
          data: data,
        }],
      },
      options: {
        responsive: true,
        animation: {
          duration: 0, // Desactiva la animación inicial
        },
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          datalabels: {
            color: '#000000',
            formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            font: {
              size: 10,
            },
            anchor: 'end',
            align: 'start',
            offset: 0,
          },
        },
      },
    });

    setChartInstance(myChart);

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (indicatorRef.current && randomNumber !== null) {
      const segmentAngle = 360 / 100; // Cada segmento tiene un ángulo de 3.6°
      const targetRotation = (randomNumber - 1) * segmentAngle;
      const extraRotations = 360 * 2; // Número de vueltas adicionales para la animación
      const finalRotation = extraRotations + targetRotation; // Rotación final
      const duration = 4000; // Duración de la animación en milisegundos

      const startRotation = 0;
      const startTime = performance.now();

      const animateRotation = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const newRotation = startRotation + (finalRotation - startRotation) * progress;

        // Gira el indicador, no la ruleta
        indicatorRef.current.style.transform = `rotate(${newRotation}deg)`;
        
        if (progress < 1) {
          requestAnimationFrame(animateRotation);
        }
      };

      requestAnimationFrame(animateRotation);
    }
  }, [randomNumber]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas ref={wheelRef} style={{ width: '400px', height: '400px', borderRadius: '10%' }}></canvas>
      <div
        ref={indicatorRef}
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          width: '2px',
          height: '150px',
          backgroundColor: 'black',
          transformOrigin: 'bottom',
          transform: 'translateX(-50%) rotate(0deg)', // El ángulo será actualizado por useEffect
        }}
      ></div>
    </div>
  );
};

export default Wheel;
