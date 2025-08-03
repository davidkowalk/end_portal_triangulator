document.getElementById('toggle-uncertainties').addEventListener('click', function () {
  const section = document.getElementById('uncertainty-section');
  section.classList.toggle('open');

  const label = document.getElementById('toggle-uncertainties');
  const isOpen = section.classList.contains('open');
  label.textContent = isOpen ? 'Uncertainties ▲' : 'Uncertainties ▼';
});


function randomNormal(mean = 0, stdDev = 1) {
  let u1 = Math.random();
  let u2 = Math.random();
  let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}



function run_triangulation() {
    const x1 = parseFloat(document.getElementById("x1").value);
    const z1 = parseFloat(document.getElementById("z1").value);
    const theta1 = parseFloat(document.getElementById("theta1").value);

    const x2 = parseFloat(document.getElementById("x2").value);
    const z2 = parseFloat(document.getElementById("z2").value);
    const theta2 = parseFloat(document.getElementById("theta2").value);

    const dx = parseFloat(document.getElementById("x-uncertainty").value) || 0;
    const dz = parseFloat(document.getElementById("z-uncertainty").value) || 0;
    const dtheta = parseFloat(document.getElementById("angle-uncertainty").value) || 0;

    output = calculate_position(x1, z1, theta1, x2, z2, theta2);

    document.getElementById("xout").innerHTML = Math.round(10*output._data[0])/10;
    document.getElementById("zout").innerHTML = Math.round(10*output._data[1])/10;


    //runMonteCarlo(x1, z1, theta1, x2, z2, theta2, dx, dz, dtheta, N=1000);
}

function calculate_position(x1, z1, theta1, x2, z2, theta2) {
    
    m1 = -Math.tan((theta1* Math.PI) / 180);
    m2 = -Math.tan((theta2* Math.PI) / 180);

    
    M = math.matrix([
                        [m1, -1],
                        [m2, -1]]
                    );

    M_inv = math.inv(M);    

    vector = math.matrix([[m1*x1 - z1], [m2*x2 - z2]]);

    output = math.multiply(M_inv, vector);
    return output;
}
