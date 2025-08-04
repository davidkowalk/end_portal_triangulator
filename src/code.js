document.getElementById('toggle-uncertainties').addEventListener('click', function() {
    const section = document.getElementById('uncertainty-section');
    section.classList.toggle('open');

    const label = document.getElementById('toggle-uncertainties');
    const isOpen = section.classList.contains('open');
    label.textContent = isOpen ? 'Advanced ▲' : 'Advanced ▼';
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

    const dx = parseFloat(document.getElementById("x-uncertainty").value) || 0.5;
    const dz = parseFloat(document.getElementById("z-uncertainty").value) || 0.5;
    const dtheta = parseFloat(document.getElementById("angle-uncertainty").value) || 0.1;

    const N = parseInt(document.getElementById("mc_n").value) || 5000;

    output = calculate_position(x1, z1, theta1, x2, z2, theta2);

    document.getElementById("xout").innerHTML = Math.round(10 * output._data[0]) / 10;
    document.getElementById("zout").innerHTML = Math.round(10 * output._data[1]) / 10;


    var [x_err, z_err] = runMonteCarlo(x1, z1, theta1, x2, z2, theta2, dx, dz, dtheta, output._data[0][0], output._data[1][0], N);

    document.getElementById("dx").innerHTML = Math.round(10 * x_err) / 10;
    document.getElementById("dz").innerHTML = Math.round(10 * z_err) / 10;
}

function calculate_position(x1, z1, theta1, x2, z2, theta2) {

    m1 = -Math.tan(((90 - theta1) * Math.PI) / 180);
    m2 = -Math.tan(((90 - theta2) * Math.PI) / 180);


    M = math.matrix([
        [m1, -1],
        [m2, -1]
    ]);

    M_inv = math.inv(M);

    vector = math.matrix([
        [m1 * x1 - z1],
        [m2 * x2 - z2]
    ]);

    output = math.multiply(M_inv, vector);
    return output;
}



function runMonteCarlo(x1_mean, z1_mean, theta1_mean, x2_mean, z2_mean, theta2_mean, dx, dz, dtheta, xnominal, znominal, N = 10000) {

    const xResults = [];
    const zResults = [];

    for (let i = 0; i < N; i++) {
        x1 = randomNormal(x1_mean, dx);
        z1 = randomNormal(z1_mean, dz);
        theta1 = randomNormal(theta1_mean, dtheta);

        x2 = randomNormal(x2_mean, dx);
        z2 = randomNormal(z2_mean, dz);
        theta2 = randomNormal(theta2_mean, dtheta);

        try {
            const result = calculate_position(x1, z1, theta1, x2, z2, theta2);
            const x = result._data[0][0];
            const z = result._data[1][0];

            if (isFinite(x) && isFinite(z)) {
                xResults.push(x);
                zResults.push(z);
            }
        } catch (err) {
            // skip singular matrix or math errors
            continue;
        }
    }

    if (xResults.length === 0) {
        alert("Monte Carlo failed: No valid samples.");
        return;
    }


    // 2D histogram heatmap
    var x_min = Math.floor(Math.min(...xResults));
    var x_max = Math.ceil(Math.max(...xResults));
    var z_min = Math.floor(Math.min(...zResults));
    var z_max = Math.ceil(Math.max(...zResults));

    const max_size = 1000;

    if (Math.abs(x_min - xnominal) > max_size) {
        x_min = xnominal - max_size
    };
    if (Math.abs(x_max - xnominal) > max_size) {
        x_max = xnominal + max_size
    };

    if (Math.abs(z_min - znominal) > max_size) {
        z_min = znominal - max_size
    };
    if (Math.abs(z_max - znominal) > max_size) {
        z_max = znominal + max_size
    };

    const data = [{
        x: xResults,
        y: zResults,
        type: 'histogram2d',
        histnorm: 'probability density',
        colorscale: 'Hot',
        xbins: {
            start: x_min,
            end: x_max,
            size: 1
        },
        ybins: {
            start: z_min,
            end: z_max,
            size: 1
        }
    }];


    const layout = {
        title: 'Estimated Probability Distribution (Monte Carlo)',
        xaxis: {
            title: 'X'
        },
        yaxis: {
            title: 'Z',
            autorange: "reversed"
        },
        height: 800
    };

    Plotly.newPlot('plot', data, layout);

    const xLower = math.quantileSeq(xResults, 0.15865, false);
    const xUpper = math.quantileSeq(xResults, 0.84135, false);

    const zLower = math.quantileSeq(zResults, 0.15865, false);
    const zUpper = math.quantileSeq(zResults, 0.84135, false);

    return [(xUpper - xLower) / 2, (zUpper - zLower) / 2]

}