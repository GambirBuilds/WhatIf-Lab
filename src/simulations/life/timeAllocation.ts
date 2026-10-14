import { SimulationDefinition, SimulationResult } from '../../engine/types';
import { formatNumber, formatPercent } from '../../utils/formatters';

export const timeAllocationSimulation: SimulationDefinition = {
  id: 'time-allocation',
  title: 'Weekly Time Budget & Compounding Mastery',
  tagline: 'Balance your 168-hour weekly budget, calculate slack buffer, and project 5-year skill accumulation.',
  category: 'life',
  categoryLabel: 'Life & Personal Growth',
  difficulty: 'Beginner',
  estimatedMinutes: 4,
  modelType: 'Analytical Model',
  iconName: 'Clock',
  description:
    'Every human receives exactly 168 hours each week. Explore how your allocation across sleep, career, deep study, health, and leisure compounds into mastery hours over multi-year horizons—or leaves you with negative buffer.',
  variables: [
    {
      id: 'sleepHoursDay',
      label: 'Sleep & Rest (Hours / Day)',
      description: 'Daily nightly restorative sleep and wind-down time.',
      min: 4,
      max: 11,
      step: 0.5,
      defaultValue: 7.5,
      unit: 'hrs/day',
      formatType: 'number',
    },
    {
      id: 'workHoursDay',
      label: 'Core Work / School (Hours / Day)',
      description: 'Daily mandatory primary employment or academic commitments (5-day equivalent).',
      min: 0,
      max: 14,
      step: 0.5,
      defaultValue: 8.0,
      unit: 'hrs/day',
      formatType: 'number',
    },
    {
      id: 'learningHoursWeek',
      label: 'Deliberate Skill Practice / Week',
      description: 'Focused, distraction-free deliberate learning (coding, language, music, writing).',
      min: 0,
      max: 30,
      step: 1,
      defaultValue: 10,
      unit: 'hrs/wk',
      formatType: 'number',
    },
    {
      id: 'exerciseHoursWeek',
      label: 'Fitness & Physical Wellness / Week',
      description: 'Strength training, cardio, mobility, or recreational athletics.',
      min: 0,
      max: 20,
      step: 0.5,
      defaultValue: 5,
      unit: 'hrs/wk',
      formatType: 'number',
    },
    {
      id: 'choresHoursDay',
      label: 'Chores, Cooking & Commute / Day',
      description: 'Daily basic life maintenance: meal preparation, errands, commuting, hygiene.',
      min: 1,
      max: 6,
      step: 0.5,
      defaultValue: 2.5,
      unit: 'hrs/day',
      formatType: 'number',
    },
    {
      id: 'leisureHoursDay',
      label: 'Leisure, Social & Screen Time / Day',
      description: 'Casual entertainment, gaming, social media, hanging out with friends.',
      min: 0,
      max: 10,
      step: 0.5,
      defaultValue: 3.0,
      unit: 'hrs/day',
      formatType: 'number',
    },
  ],
  presets: [
    {
      id: 'preset-balanced',
      name: 'Sustainable High-Performer',
      description: '7.5h sleep, 8h work, 10h skill practice, 5h exercise, healthy leisure.',
      inputs: {
        sleepHoursDay: 7.5,
        workHoursDay: 8.0,
        learningHoursWeek: 10,
        exerciseHoursWeek: 5,
        choresHoursDay: 2.5,
        leisureHoursDay: 2.5,
      },
    },
    {
      id: 'preset-deep-focus',
      name: 'Intense Skill Sabbatical',
      description: 'Minimal job commitments, 20h/week dedicated to learning a new craft.',
      inputs: {
        sleepHoursDay: 8.0,
        workHoursDay: 4.0,
        learningHoursWeek: 20,
        exerciseHoursWeek: 6,
        choresHoursDay: 2.0,
        leisureHoursDay: 2.0,
      },
    },
    {
      id: 'preset-overcommitted',
      name: 'Overloaded / Redline Pace',
      description: 'Long workdays with low sleep and packed calendar causing time deficit.',
      inputs: {
        sleepHoursDay: 6.0,
        workHoursDay: 10.0,
        learningHoursWeek: 12,
        exerciseHoursWeek: 4,
        choresHoursDay: 3.0,
        leisureHoursDay: 3.0,
      },
    },
  ],
  assumptions: [
    'One calendar week consists of exactly 7 days = 168 total clock hours.',
    'Work hours assume a 5-day schedule; sleep, chores, and leisure are computed across all 7 days.',
    'Skill accumulation is assumed to occur with 85% deliberate retention effectiveness over 50 active weeks/year.',
  ],
  limitations: [
    'Does not claim to predict medical health, career promotions, or personal happiness.',
    'Human energy and focus fluctuate throughout the day; 10 theoretical hours do not equal 10 peak cognitive hours.',
    'Life emergencies, seasonal vacations, and illness disruptions are not modeled.',
  ],
  formulas: [
    {
      name: 'Total Weekly Allocated Hours',
      equation: 'TotalAllocated = (Sleep \\times 7) + (Work \\times 5) + (Chores \\times 7) + (Leisure \\times 7) + Learning + Exercise',
      explanation: 'Sum of all committed activities across the 168 available hours.',
    },
    {
      name: 'Discretionary Slack Buffer',
      equation: 'SlackBuffer = 168 - TotalAllocated',
      explanation: 'Margin of safety for unexpected events, spontaneous rest, or delays.',
    },
    {
      name: 'Annual Deliberate Practice Hours',
      equation: 'AnnualPractice = Learning \\times 50\\text{ active weeks}',
      explanation: 'Compounded practice time toward skill development each calendar year.',
    },
  ],
  calculate(inputs: Record<string, number>): SimulationResult {
    const sleep = Math.max(0, inputs.sleepHoursDay ?? 7.5);
    const work = Math.max(0, inputs.workHoursDay ?? 8.0);
    const learning = Math.max(0, inputs.learningHoursWeek ?? 10);
    const exercise = Math.max(0, inputs.exerciseHoursWeek ?? 5);
    const chores = Math.max(0, inputs.choresHoursDay ?? 2.5);
    const leisure = Math.max(0, inputs.leisureHoursDay ?? 3.0);

    const weeklySleep = sleep * 7;
    const weeklyWork = work * 5;
    const weeklyChores = chores * 7;
    const weeklyLeisure = leisure * 7;

    const totalCommitted = weeklySleep + weeklyWork + weeklyChores + weeklyLeisure + learning + exercise;
    const slackBuffer = 168 - totalCommitted;

    const annualPracticeHours = learning * 50;
    const fiveYearPracticeHours = annualPracticeHours * 5;

    // 5-Year Cumulative Mastery Chart Data
    const chartData: any[] = [];
    for (let yr = 0; yr <= 5; yr++) {
      const cumLearning = yr * annualPracticeHours;
      const cumExercise = yr * exercise * 50;
      const cumWork = yr * weeklyWork * 50;

      chartData.push({
        year: yr === 0 ? 'Start' : `Year ${yr}`,
        practiceHours: cumLearning,
        exerciseHours: cumExercise,
        workHours: cumWork,
      });
    }

    const isDeficit = slackBuffer < 0;
    const insights: string[] = [];

    if (isDeficit) {
      insights.push(
        `Deficit Warning: You have overcommitted your schedule by ${Math.abs(slackBuffer).toFixed(1)} hours/week. In reality, this debt is often borrowed from sleep or high stress.`
      );
    } else if (slackBuffer < 10) {
      insights.push(
        `Tight Margin: You have ${slackBuffer.toFixed(1)} hours/week (${(slackBuffer / 7).toFixed(1)}h/day) of unallocated margin. High vulnerability to unexpected life disruptions.`
      );
    } else {
      insights.push(
        `Healthy Buffer: You retain ${slackBuffer.toFixed(1)} hours/week of discretionary breathing room for recovery, spontaneous socializing, and resilience.`
      );
    }

    insights.push(
      `At ${learning} hrs/week, you accumulate ${formatNumber(annualPracticeHours)} hours of deliberate practice each year (${formatNumber(fiveYearPracticeHours)} hours over 5 years).`
    );

    if (fiveYearPracticeHours >= 2500) {
      insights.push(
        `Accumulating over 2,500 focused hours places you well into top-tier occupational competency in a new discipline.`
      );
    }

    return {
      primaryMetric: {
        id: 'slackBuffer',
        label: 'Weekly Slack Buffer',
        value: slackBuffer,
        formattedValue: `${slackBuffer >= 0 ? '+' : ''}${slackBuffer.toFixed(1)} hrs/wk`,
        unit: 'hrs/week',
        isPrimary: true,
        sentiment: slackBuffer >= 10 ? 'positive' : slackBuffer >= 0 ? 'neutral' : 'negative',
        explanation: 'Unscheduled margin remaining out of 168 weekly hours.',
      },
      metrics: [
        {
          id: 'annualLearning',
          label: 'Annual Skill Practice',
          value: annualPracticeHours,
          formattedValue: `${formatNumber(annualPracticeHours)} hrs/yr`,
          sentiment: 'positive',
          explanation: `Equivalent to ${(annualPracticeHours / 40).toFixed(1)} full-time 40-hour work weeks.`,
        },
        {
          id: 'fiveYearMastery',
          label: '5-Year Accumulated Practice',
          value: fiveYearPracticeHours,
          formattedValue: `${formatNumber(fiveYearPracticeHours)} hrs`,
          sentiment: 'positive',
          explanation: `Cumulative focused development over half a decade.`,
        },
        {
          id: 'weeklySleep',
          label: 'Weekly Sleep Allocation',
          value: weeklySleep,
          formattedValue: `${weeklySleep.toFixed(1)} hrs/wk`,
          sentiment: sleep >= 7 ? 'positive' : 'negative',
          explanation: `${sleep} hrs/day (${formatPercent(weeklySleep / 168)} of entire week).`,
        },
        {
          id: 'workRatio',
          label: 'Career / Academic Share',
          value: weeklyWork / 168,
          formattedValue: formatPercent(weeklyWork / 168),
          sentiment: 'neutral',
          explanation: `${weeklyWork.toFixed(0)} hours committed to core work and academic load.`,
        },
      ],
      chartData,
      chartConfig: {
        title: '5-Year Cumulative Compounding of Practice, Wellness & Career Hours',
        description: 'Multi-year trajectory demonstrating how consistent weekly routines build massive hour accumulations.',
        type: 'line',
        xAxisKey: 'year',
        xAxisLabel: 'Timeline',
        yAxisLabel: 'Cumulative Hours',
        series: [
          { dataKey: 'practiceHours', name: 'Deliberate Skill Practice (Hrs)', color: '#35D9FF' },
          { dataKey: 'exerciseHours', name: 'Fitness & Physical Health (Hrs)', color: '#38D996' },
        ],
      },
      insights,
    };
  },
};
