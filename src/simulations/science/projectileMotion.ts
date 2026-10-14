import { SimulationDefinition, SimulationResult } from '../../engine/types';
import { formatNumber } from '../../utils/formatters';

export const projectileMotionSimulation: SimulationDefinition = {
  id: 'projectile-motion',
  title: 'Ballistic Motion & Gravitational Kinematics',
  tagline: 'Simulate Newtonian projectile trajectories across Earth, the Moon, and Mars.',
  category: 'science',
  categoryLabel: 'Physics & Science',
  difficulty: 'Intermediate',
  estimatedMinutes: 5,
  modelType: 'Analytical Model',
  iconName: 'Atom',
  description:
    'Explore classical mechanics under constant gravitational acceleration. Calculate the parabolic trajectory, maximum apogee, hang time, and impact kinetic velocity for any launch velocity, angle, and planetary gravity.',
  variables: [
    {
      id: 'velocity',
      label: 'Initial Launch Speed (v₀)',
      description: 'Magnitude of the launch velocity vector.',
      min: 5,
      max: 150,
      step: 1,
      defaultValue: 35,
      unit: 'm/s',
      formatType: 'number',
    },
    {
      id: 'angle',
      label: 'Launch Elevation Angle (θ)',
      description: 'Angle above the horizontal ground plane (45° maximizes vacuum range on level ground).',
      min: 5,
      max: 89,
      step: 1,
      defaultValue: 45,
      unit: 'deg',
      formatType: 'number',
    },
    {
      id: 'initialHeight',
      label: 'Initial Launch Height (y₀)',
      description: 'Vertical elevation of the launcher above target ground impact level.',
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 2,
      unit: 'm',
      formatType: 'number',
    },
    {
      id: 'gravity',
      label: 'Gravitational Acceleration (g)',
      description: 'Downward gravitational field strength (Earth: 9.81 m/s², Moon: 1.62 m/s², Mars: 3.72 m/s²).',
      min: 1.0,
      max: 25.0,
      step: 0.1,
      defaultValue: 9.81,
      unit: 'm/s²',
      formatType: 'number',
      decimals: 2,
    },
  ],
  presets: [
    {
      id: 'preset-earth-standard',
      name: 'Earth Standard (45° Launch)',
      description: '35 m/s launch at 45° elevation on Earth (g = 9.81 m/s²).',
      inputs: {
        velocity: 35,
        angle: 45,
        initialHeight: 2,
        gravity: 9.81,
      },
    },
    {
      id: 'preset-moon',
      name: 'Lunar Surface (Apollo Sandbox)',
      description: '35 m/s launch in 1/6th gravity of the Moon (g = 1.62 m/s²). Massive range!',
      inputs: {
        velocity: 35,
        angle: 45,
        initialHeight: 2,
        gravity: 1.62,
      },
    },
    {
      id: 'preset-mars',
      name: 'Mars Surface Expedition',
      description: 'High velocity launch on Mars (g = 3.72 m/s²).',
      inputs: {
        velocity: 50,
        angle: 38,
        initialHeight: 5,
        gravity: 3.72,
      },
    },
    {
      id: 'preset-cliff',
      name: 'High Cliff Launch (Elevated 50m)',
      description: 'Launching from a 50-meter cliff at 30° elevation.',
      inputs: {
        velocity: 28,
        angle: 30,
        initialHeight: 50,
        gravity: 9.81,
      },
    },
  ],
  assumptions: [
    'Trajectory operates in a vacuum without aerodynamic atmospheric drag or crosswind turbulence.',
    'Gravitational acceleration vector is uniform and directed strictly downwards (-y direction).',
    'Planetary surface curvature and Coriolis effect are negligible over the modeled flight range.',
  ],
  limitations: [
    'Real-world projectiles on Earth experience substantial aerodynamic drag, reducing actual range by 20% to 50%.',
    'Does not simulate Magnus spin effect or terminal velocity limits.',
  ],
  formulas: [
    {
      name: 'Velocity Decomposition',
      equation: 'v_{0x} = v_0 \\cos(\\theta), \\quad v_{0y} = v_0 \\sin(\\theta)',
      explanation: 'Resolves initial launch vector into independent horizontal and vertical scalar components.',
    },
    {
      name: 'Time of Flight (Impact at y = 0)',
      equation: 't_{flight} = \\frac{v_{0y} + \\sqrt{v_{0y}^2 + 2 g y_0}}{g}',
      explanation: 'Derived from the kinematic equation y(t) = y_0 + v_{0y}t - \\frac{1}{2}gt^2 by setting y(t) = 0.',
    },
    {
      name: 'Maximum Apogee Height',
      equation: 'H_{max} = y_0 + \\frac{v_{0y}^2}{2 g}',
      explanation: 'Point where instantaneous vertical velocity v_y reaches zero.',
    },
    {
      name: 'Total Horizontal Range',
      equation: 'X_{range} = v_{0x} \\times t_{flight}',
      explanation: 'Horizontal distance traversed with constant velocity in vacuum.',
    },
  ],
  calculate(inputs: Record<string, number>): SimulationResult {
    const v0 = Math.max(1, inputs.velocity ?? 35);
    const deg = Math.max(1, Math.min(89, inputs.angle ?? 45));
    const y0 = Math.max(0, inputs.initialHeight ?? 2);
    const g = Math.max(0.5, inputs.gravity ?? 9.81);

    const rad = (deg * Math.PI) / 180;
    const v0x = v0 * Math.cos(rad);
    const v0y = v0 * Math.sin(rad);

    // Quadratic solution for flight time: -0.5*g*t^2 + v0y*t + y0 = 0
    // t = (v0y + sqrt(v0y^2 + 2*g*y0)) / g
    const discriminant = v0y * v0y + 2 * g * y0;
    const tFlight = (v0y + Math.sqrt(discriminant)) / g;

    const maxApogee = y0 + (v0y * v0y) / (2 * g);
    const range = v0x * tFlight;

    // Impact velocity: vx = v0x, vy = v0y - g*tFlight
    const vyImpact = v0y - g * tFlight;
    const vImpact = Math.sqrt(v0x * v0x + vyImpact * vyImpact);

    // Generate trajectory curve y(x) with 25 points
    const chartData: any[] = [];
    const samples = 25;
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tFlight;
      const x = v0x * t;
      const y = Math.max(0, y0 + v0y * t - 0.5 * g * t * t);
      chartData.push({
        x: Math.round(x * 10) / 10,
        altitude: Math.round(y * 10) / 10,
        time: Math.round(t * 10) / 10,
      });
    }

    const insights: string[] = [
      `The projectile achieves a total horizontal range of ${range.toFixed(1)} meters and hangs in the air for ${tFlight.toFixed(2)} seconds.`,
      `Peak apogee reaches ${maxApogee.toFixed(1)} meters above ground level.`,
      `Impact speed on the surface is ${vImpact.toFixed(1)} m/s (${(vImpact * 3.6).toFixed(1)} km/h).`,
      g < 5
        ? `In this low-gravity field (g = ${g} m/s²), objects travel ${(9.81 / g).toFixed(1)}x further than on Earth!`
        : `Earth gravity (9.81 m/s²) rapidly pulls the parabolic trajectory downward.`,
    ];

    return {
      primaryMetric: {
        id: 'horizontalRange',
        label: 'Total Horizontal Range',
        value: range,
        formattedValue: `${range.toFixed(1)} m`,
        unit: 'meters',
        isPrimary: true,
        sentiment: 'positive',
        explanation: 'Distance traversed from launch point to ground impact.',
      },
      metrics: [
        {
          id: 'maxApogee',
          label: 'Maximum Peak Height',
          value: maxApogee,
          formattedValue: `${maxApogee.toFixed(1)} m`,
          sentiment: 'positive',
          explanation: 'Highest vertical elevation achieved at zero vertical velocity.',
        },
        {
          id: 'timeOfFlight',
          label: 'Total Flight Duration',
          value: tFlight,
          formattedValue: `${tFlight.toFixed(2)} s`,
          sentiment: 'neutral',
          explanation: 'Elapsed airborne seconds before ground contact.',
        },
        {
          id: 'impactVelocity',
          label: 'Impact Speed',
          value: vImpact,
          formattedValue: `${vImpact.toFixed(1)} m/s`,
          sentiment: 'neutral',
          explanation: `${(vImpact * 3.6).toFixed(1)} km/h velocity vector at landing.`,
        },
        {
          id: 'horizontalVelocity',
          label: 'Horizontal Speed (vx)',
          value: v0x,
          formattedValue: `${v0x.toFixed(1)} m/s`,
          sentiment: 'neutral',
          explanation: 'Constant speed maintained horizontally in vacuum.',
        },
      ],
      chartData,
      chartConfig: {
        title: 'Ballistic Trajectory Curve: Altitude vs Horizontal Distance',
        description: 'Parabolic flight path of the projectile from launch to ground impact.',
        type: 'area',
        xAxisKey: 'x',
        xAxisLabel: 'Horizontal Distance (m)',
        yAxisLabel: 'Altitude (m)',
        series: [
          { dataKey: 'altitude', name: 'Altitude (m)', color: '#35D9FF', type: 'area' },
        ],
      },
      insights,
    };
  },
};
