![GitHub License](https://img.shields.io/github/license/davidkowalk/end_portal_triangulator)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/davidkowalk/end_portal_triangulator)
![GitHub Release](https://img.shields.io/github/v/release/davidkowalk/end_portal_triangulator?labelColor=green)



# End Portal Triangulator

The end portal triangulator is an application for Minecraft players to calculate the position of an end portal using two consecutive throws of an ender pearl.
The position is calculated using linear algebra and a Monte Carlo simulation is used to estimate the uncertainty.

## Installation

The web app can be found in the `src` folder of the repository. It does not need to be installed.
To run the app simply open `triangulate.html` in a web browser. JavaScript needs to be enabled.

The application pulls the dependencies of `Plotly` and `math.js` from the internet, therefore a connection is required.

## Example

Two pearl throws were recorded:

Throw   | x | z | Angle $\theta$
--------|---|---|-------
1       | 10| 33| -38.2°
2       |119| 19| -34.7°

The following uncertainties were used: $\Delta x = \Delta z = 0.5$ and $\Delta \theta = 0.1°$. The calculated position of the stronghold is
X | Z
--|--
998.5±38.5 | 1289.2±52.2

![](./docs/img/distribution.png)