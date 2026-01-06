import React from 'react';
import { 
  Document, Page, Text, View, StyleSheet, 
  Image, PDFDownloadLink, Svg, Path, G, Line, Circle, Polyline,
  Defs,
  LinearGradient,
  Stop,
  Rect
} from '@react-pdf/renderer';
import { chord, ribbon, ChordGroup } from "d3-chord";
import { arc } from "d3-shape";
import { Button } from '../ui/button';
import { FileDown } from 'lucide-react';
import { descending } from 'd3-array';

const styles = StyleSheet.create({
  page: { 
    paddingTop: 20, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    fontSize: 10, 
    fontFamily: 'Helvetica', 
    backgroundColor: '#fff' 
  },
  header: { fontSize: 25, marginBottom: 10, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  subHeader: { fontSize: 15, marginBottom: 30, fontWeight: 'bold', color: '#000' },
  
  // Layout zigzag cho Analysis Blocks
  row: { flexDirection: 'row', marginBottom: 25, alignItems: 'center', gap: 20 },
  rowReverse: { flexDirection: 'row-reverse', marginBottom: 25, alignItems: 'center', gap: 20 },
  columnText: { flex: 1 },
  columnImage: { flex: 1, height: 100, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },

  timelineContainer: { marginTop: 20, borderTop: '1px solid #ccc', paddingTop: 20 },
  
  // Section 1: 2 Pie Charts
  comparisonRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 40 },
  pieColumn: { width: '20%', alignItems: 'center', justifyContent: 'center' },
  chartTitle: { fontSize: 10, marginBottom: 5, textAlign: 'center' },
  pieAnalysis: { marginTop: 10, fontSize: 9, color: '#444', textAlign: 'justify' },

  // Section 2: Interaction Chord
  interactionRow: { flexDirection: 'row', marginTop: 20, alignItems: 'center', gap: 20 },
  interactionTextSide: { width: '50%' },
  interactionChartSide: { width: '50%', alignItems: 'center' },
  
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 15, borderBottom: '1pt solid #eee', paddingBottom: 5, marginTop: 10 },
  highlightBox: { padding: 10, backgroundColor: '#f0f7ff', marginTop: 10, borderRadius: 4, borderLeft: '3pt solid #1e40af' }
});

// --- HELPERS ---
const wrapText = (text: string, maxChars: number) => {
  if (!text) return [""];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  words.forEach(word => {
    if ((currentLine + word).length > maxChars) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  lines.push(currentLine.trim());
  return lines;
};

const processPieData = (rawData) => {
  if (!rawData) return [];
  const threshold = 5;
  const main = rawData.filter(d => d.percentage >= threshold);
  const others = rawData.filter(d => d.percentage < threshold);
  
  const processed = main?.map((d, i) => ({
    label: d.speaker,
    value: d.seconds,
    color: d.speaker === 'Facilitator' ? '#1e40af' : ['#3b82f6', '#60a5fa', '#93c5fd'][i % 3]
  }));

  if (others.length > 0) {
    processed.push({
      label: 'Others',
      value: others.reduce((sum, d) => sum + d.seconds, 0),
      color: '#cbd5e1'
    });
  }
  return processed;
};

const COLORS = [
  "#0D9488", // teal-600
  "#3B82F6", // blue-500
  "#8B5CF6", // purple-500
  "#EC4899", // pink-500
  "#F97316", // orange-500
  "#10B981", // emerald-500
  "#6366F1", // indigo-500
  "#F43F5E", // rose-500
  "#06B6D4", // cyan-500
];

// --- CHART COMPONENTS ---
const PieChartSvg = ({ data, width }: { data: any[], width: number }) => {
  const total = data.reduce((sum, item) => sum + item.seconds, 0);
  let cumulativeAngle = -Math.PI / 2; 

  return (
    <Svg viewBox="-120 -120 240 240" style={{ width: width, height: width }}>
      {data?.map((item, i) => {
        const fraction = item.seconds / total;
        const angle = fraction * 2 * Math.PI;
        const rOut = 110; const rIn = 55;
        const largeArcFlag = fraction > 0.5 ? 1 : 0;

        const x1 = rOut * Math.cos(cumulativeAngle);
        const y1 = rOut * Math.sin(cumulativeAngle);
        const x2 = rOut * Math.cos(cumulativeAngle + angle);
        const y2 = rOut * Math.sin(cumulativeAngle + angle);
        const x3 = rIn * Math.cos(cumulativeAngle + angle);
        const y3 = rIn * Math.sin(cumulativeAngle + angle);
        const x4 = rIn * Math.cos(cumulativeAngle);
        const y4 = rIn * Math.sin(cumulativeAngle);

        const d = [`M ${x1} ${y1}`, `A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2} ${y2}`, `L ${x3} ${y3}`, `A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x4} ${y4}`, `Z`].join(' ');
        
        const midAngle = cumulativeAngle + angle / 2;
        const textX = ((rOut + rIn) / 2) * Math.cos(midAngle);
        const textY = ((rOut + rIn) / 2) * Math.sin(midAngle);
        cumulativeAngle += angle;

        return (
          <G key={i}>
            <Path d={d} fill={COLORS[i % 8]} stroke="#fff" strokeWidth={1} />
            {fraction > 0.08 && (
              <G>
                {wrapText(item.speaker ? item.speaker : 'Inaudible or Silent', 10)?.map((line, idx) => (
                  <Text key={idx} x={textX} y={textY - 3 + (idx * 7)} fill="#fff" style={{ fontSize: 6, fontWeight: 'bold' }} textAnchor="middle">{line}</Text>
                ))}
              </G>
            )}
          </G>
        );
      })}
    </Svg>
  );
};

const InteractionChordPdf = ({ interactions, labels, colors, width }: { interactions: number[][], labels: string[], colors: string[], width: number }) => {
  const outerRadius = 105;
  const innerRadius = outerRadius - 12;

  const chordGenerator = chord().padAngle(0.05).sortSubgroups(descending);
  const chords = chordGenerator(interactions);
  const arcGenerator = arc<ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius);

  const polar = (r: number, a: number) => [
    Math.sin(a) * r,
    -Math.cos(a) * r,
  ];

  const ribbonWithArrow = (c: any, r0: number) => {
    const { source, target } = c;
    const arrowLength = 8; 
    const rBase = r0 - arrowLength; 

    const sa0 = source.startAngle, sa1 = source.endAngle;
    const ta0 = target.startAngle, ta1 = target.endAngle;
    const taMid = (ta0 + ta1) / 2;

    const [sx0, sy0] = polar(r0, sa0);
    const [sx1, sy1] = polar(r0, sa1);

    const [tb0x, tb0y] = polar(rBase, ta0);
    const [tb1x, tb1y] = polar(rBase, ta1);
    const [tipX, tipY] = polar(r0, taMid);

    return `
      M ${sx0},${sy0}
      A ${r0},${r0} 0 0,1 ${sx1},${sy1}
      Q 0,0 ${tb0x},${tb0y}
      L ${tipX},${tipY}
      L ${tb1x},${tb1y}
      Q 0,0 ${sx0},${sy0}
      Z
    `;
  };

  return (
    <Svg viewBox="-125 -125 240 300" style={{ width: width, height: width }}>
      {chords?.map((c, i) => {
        const pathData = ribbonWithArrow(c, innerRadius);;
        const color = COLORS[c.source.index % colors.length];
        return (
          <Path key={i} d={pathData || ""} fill={color} opacity={0.6} stroke={color} strokeWidth={0.5} />
        );
      })}
      {chords.groups?.map((group, i) => {
        const pathData = arcGenerator(group) as unknown as string;
        const angle = (group.startAngle + group.endAngle) / 2;
        const x = Math.sin(angle) * (outerRadius + 15);
        const y = -Math.cos(angle) * (outerRadius + 15);
        return (
          <G key={i}>
            <Path d={pathData || ""} fill={COLORS[i % colors.length]} />
          </G>
        );
      })}
    </Svg>
  );
};

const progressionStyles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineSample: {
    width: 25,
    height: 2,
    marginRight: 5,
  }
});

const ProgressionLineChart = ({ progressionData }) => {
  const width = 500;
  const height = 200;
  const paddingX = 60;
  const paddingY = 40;
  const maxScore = 4;

  const markers = progressionData[0]?.markers?.map(m => m.name) || [];
  const sessions = progressionData;

  const sessionConfigs = [
    { color: '#f59e0b', dash: "" },
    { color: '#1e40af', dash: "4,2" },
    { color: '#e600ff', dash: "1,2" },
    { color: '#ffd287' }, 
    { color: '#4f64a8' }, 
    { color: '#eb7cf7' }, 
  ];

  const getX = (index) => paddingX + (index * (width - 2 * paddingX) / (markers.length - 1));
  const getY = (score) => height - paddingY - (score * (height - 2 * paddingY) / maxScore);

  const yZero = getY(0);

  return (
    <View style={progressionStyles.chartContainer}>
      <View style={progressionStyles.legendRow}>
        {sessions?.map((session, i) => (
          <View key={i} style={progressionStyles.legendItem}>
            <View style={{
              width: 20,           
              height: 20,
              borderRadius: 15,       
              borderWidth: 4,
              borderColor: sessionConfigs[i + 3].color,   
              marginRight: 8,
              backgroundColor: sessionConfigs[i].color, 
            }} />
            <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{session.sessionLabel}</Text>
          </View>
        ))}
      </View>
      
      <Svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 270 }}>
        <Line 
          x1={paddingX - 10} y1={yZero} 
          x2={paddingX - 10} y2={10} 
          stroke="#000" strokeWidth={1.5} 
        />
        <Path d={`M ${paddingX - 13} 15 L ${paddingX - 10} 5 L ${paddingX - 7} 15`} fill="#000" />
        
        <Line 
          x1={paddingX - 10} y1={yZero} 
          x2={width - 10} y2={yZero} 
          stroke="#000" strokeWidth={1.5} 
        />
        <Path d={`M ${width - 15} ${yZero - 3} L ${width - 5} ${yZero} L ${width - 15} ${yZero + 3}`} fill="#000" />

        {[0, 1, 2, 3, 4]?.map((s) => (
          <G key={s}>
            <Line 
              x1={paddingX} y1={getY(s)} x2={width - 30} y2={getY(s)} 
              stroke="#e5e7eb" strokeWidth={0.5} 
            />
            <Text x={paddingX - 25} y={getY(s) + 3} style={{ fontSize: 8, fill: '#000', fontWeight: 'bold' }}>{s}</Text>
          </G>
        ))}

        {sessions?.map((session, sIdx) => {
          const config = sessionConfigs[sIdx % sessionConfigs.length];
          const points = markers?.map((_, mIdx) => {
            const score = session.markers[mIdx]?.score || 0;
            return `${getX(mIdx)},${getY(score)}`;
          }).join(' ');

          return (
            <G key={sIdx}>
              <Polyline points={points} fill="none" stroke={config.color} strokeWidth={2} strokeDasharray={config.dash} />
              {markers?.map((_, mIdx) => (
                <Circle key={mIdx} cx={getX(mIdx)} cy={getY(session.markers[mIdx]?.score || 0)} r={3} fill={config.color} />
              ))}
            </G>
          );
        })}

        {markers?.map((name, i) => {
          const wrappedName = wrapText(name, 12); 
          return (
            <G key={i}>
              {wrappedName?.map((line, lineIdx) => (
                <Text 
                  key={lineIdx}
                  x={getX(i)} 
                  y={yZero + 15 + (lineIdx * 8)} 
                  style={{ fontSize: 7, fontWeight: 'semibold', fill: '#333' }} 
                  textAnchor="middle"
                >
                  {line}
                </Text>
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const GridAnalysis = ({ dataArray }: { dataArray: string[] }) => {
  const rows = chunkArray(dataArray, 2);

  return (
    <View style={{ marginTop: 10, gap: 10 }}>
      {rows?.map((row, rowIndex) => (
        <View 
          key={rowIndex} 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'stretch', 
            gap: 10
          }}
        >
          {row?.map((item, colIndex) => (
            <View 
              key={colIndex} 
              style={{ 
                flex: 1, 
                padding: 15, 
                backgroundColor: '#f5e2d5',
              }}
            >
              <Text style={{ fontSize: 9, lineHeight: 1.4, textAlign: 'left' }}>
                {item}
              </Text>
            </View>
          ))}
          
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
};

const easeOfUseStyles = StyleSheet.create({
  chartContainer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

const EaseOfUseLineChart = ({ data }) => {
  const width = 400;
  const height = 200;
  const paddingX = 80;
  const paddingY = 40;

  const difficultyMap = {
    "Very easy": 1,
    "Easy": 2,
    "Somewhat easy": 3,
    "Somewhat difficult": 4,
    "Difficult": 5,
    "Very difficult": 6
  };

  const sessions = data;
  const maxScore = 6;

  const sessionConfigs = [
    { color: '#f59e0b', light: '#ffd287' }, 
    { color: '#1e40af', light: '#4f64a8' }, 
    { color: '#e600ff', light: '#eb7cf7' }, 
    { color: '#10b981', light: '#a7f3d0' }, 
    { color: '#ef4444', light: '#fecaca' },
    { color: '#6366f1', light: '#c7d2fe' }, 
  ];

  const getX = (index) => paddingX + (index * (width - 2 * paddingX) / (sessions.length - 1));
  const getY = (score) => height - paddingY - ((score - 1) * (height - 2 * paddingY) / (maxScore - 1));

  const yZero = getY(1);

  const points = sessions?.map((s, i) => {
    const score = difficultyMap[s.practiceDifficulty] || 1;
    return `${getX(i)},${getY(score)}`;
  }).join(' ');

  return (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <Svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 250 }}>
        
        <Line x1={paddingX - 10} y1={yZero} x2={paddingX - 10} y2={10} stroke="#000" strokeWidth={1.5} />
        <Path d={`M ${paddingX - 13} 15 L ${paddingX - 10} 5 L ${paddingX - 7} 15`} fill="#000" />
        <Line x1={paddingX - 10} y1={yZero} x2={width - 10} y2={yZero} stroke="#000" strokeWidth={1.5} />
        <Path d={`M ${width - 15} ${yZero - 3} L ${width - 5} ${yZero} L ${width - 15} ${yZero + 3}`} fill="#000" />

        {[1, 2, 3, 4, 5, 6]?.map((s) => {
          const yPos = getY(s);
          return (
            <G key={s}>
              <Line x1={paddingX} y1={yPos} x2={width - 30} y2={yPos} stroke="#e5e7eb" strokeWidth={0.5} />
              {s === 1 ? (
                <Text x={paddingX - 15} y={yPos + 3} style={{ fontSize: 10, fontWeight: 'bold' }} textAnchor="end">Very Easy</Text>
              ) : s === 6 ? (
                <Text x={paddingX - 15} y={yPos + 3} style={{ fontSize: 10, fontWeight: 'bold' }} textAnchor="end">Very Difficult</Text>
              ) : (
                <Circle cx={paddingX - 15} cy={yPos} r={1} fill="#999" />
              )}
            </G>
          );
        })}

        <Polyline points={points} fill="none" stroke="#222" strokeWidth={3} strokeDasharray="4,2" />

        {sessions?.map((s, i) => {
          const score = difficultyMap[s.practiceDifficulty] || 1;
          const config = sessionConfigs[i % sessionConfigs.length];
          return (
            <G key={i}>
              <Circle 
                cx={getX(i)} 
                cy={getY(score)} 
                r={8} 
                fill={config.color} 
                stroke="#fff" 
                strokeWidth={2} 
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const coverStyles = StyleSheet.create({
  page: { 
    padding: 0 
  },

  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  mainContentLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowPattern: {
    height: '60%',
    opacity: 0.3,
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 200,
  },
  contentBox: {
    position: 'absolute',
    bottom: 40,
    left: 50,
    right: 50,
  }
});

const chunkArray = (arr, size) => arr?.reduce((acc, _, i) => (i % size ? acc : [...acc, arr?.slice(i, i + size)]), []);


// --- MAIN DOCUMENT ---
const ReportDocument = ({ data }: { data: any }) => {
  if (!data) return null;
  const rows = chunkArray(data.journeyTimeline || [], 3);
  const latestPieData = processPieData(data.pieDataRaw || []);
  const colorsChord = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#cbd5e1'];

  return (
    <Document>
      <Page size="A4" style={coverStyles.page}>
        <View style={coverStyles.backgroundLayer}>
          <Svg viewBox="0 0 500 800" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <Defs>
              <LinearGradient id="bgGrad" x1="500" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#310e52" />
                <Stop offset="0.5" stopColor="#8b212f" />
                <Stop offset="1" stopColor="#b53a25" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="500" height="800" fill="url(#bgGrad)" />
          </Svg>
        </View>

        <View style={coverStyles.mainContentLayer}>
          <View style={coverStyles.patternWrapper}>
            <Image src="/final_report_cover.png" style={coverStyles.arrowPattern} />
          </View>

          {/* Logo */}
          <View style={coverStyles.logoContainer}>
            <Image src="/alc_logo.png" style={{ width: '100%' }} />
          </View>

          <View style={coverStyles.contentBox}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>{data.user}'s Journey with</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }}>
              Future-Oriented Pedagogies
            </Text>
            <View style={{ height: 2, backgroundColor: 'white', width: 40, marginTop: 12, marginBottom: 15 }} />
            <Text style={{ fontSize: 10, color: 'white', opacity: 0.9, lineHeight: 1.5, fontStyle: 'italic' }}>
              An experiential journey crafted by the Adult Learning Collaboratory{"\n"}
              Analysis powered by SUSS-IAL's FOP Companion*
            </Text>
          </View>
          
        </View>
      </Page>
      {/* PAGE 2: Journey */}
      <Page size="A4" style={styles.page}>
        <Text style={[styles.header, {marginBottom: 40}]}>{data.user}'s Journey</Text>
        <Text style={styles.subHeader}>Your reports show a clear developmental arc in your practice.</Text>

        <View>
          {data.executive_summary?.map((block, index) => (
            <View key={index} style={index % 2 === 0 ? styles.row : styles.rowReverse}>
              <View style={styles.columnText}>
                <Text>{block}</Text>
              </View>
              <View style={styles.columnImage}>
                <Text style={{color: '#999'}}>No data</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20, fontStyle: 'italic' }}>
          {rows?.map((row, rowIndex) => (
            <View key={rowIndex} style={{ flexDirection: 'row', width: '100%' }}>
              {row?.map((session, index) => {
                const globalIndex = rowIndex * 3 + index + 1;
                const isLastInRow = index === row.length - 1;
                return (
                  <View key={index} style={[{ width: '33.33%', padding: 10, paddingTop: 10 * index, borderRight: '1px solid #000', minHeight: 120 }, isLastInRow && { borderRight: 'none' }]}>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 30 }}>
                      <Text style={{ fontSize: 35, fontWeight: 'semibold' }}>{globalIndex}</Text>
                      <View style={{ flex: 1, marginTop: 5 , fontSize: 15}}> 
                        <Text style={{ fontWeight: 'bold' }}>{session.course}</Text>
                        <Text>{session.date}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 9, marginBottom: 30, textAlign: 'right', fontWeight: 'semibold' }}>{session.format}</Text>
                    <Text style={{ fontSize: 9, textAlign: 'right',fontWeight: 'semibold' }}>{session.durationMinutes} mins</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </Page>

      {/* PAGE 3: Structure Analysis */}
      <Page size="A4" style={[styles.page, {paddingHorizontal: 40}]}>
        <Text style={styles.header}>Structure Analysis</Text>
        <View style={{ flexDirection: 'row', width: '100%', gap: 10, paddingVertical: 40 }}>
          <View style={{ width: '50%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
              You skillfully opened up the room for participant and engagement
            </Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{ fontSize: 10, textAlign: 'justify' }}>
              No data
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', gap: 20 }}>
          <View style={{ width: '50%'}}>
            <Text style={{ fontSize: 10, textAlign: 'justify', marginBottom: 40 }}>
              No data
            </Text>
            <View style={styles.comparisonRow}>
              <View style={styles.pieColumn}>
                <PieChartSvg width={70} data={data.talkTimeBySession[0].data} />
                <Text style={styles.chartTitle}>Session 1</Text>
              </View>
              <View style={styles.pieColumn}>
                <PieChartSvg width={70} data={data.talkTimeBySession[1].data} />
                <Text style={styles.chartTitle}>Session 2</Text>
              </View>
            </View>
          </View>
          <View style={{width: '50%', alignItems: 'center'}}>
            <View style={styles.pieColumn}>
              <Text style={styles.chartTitle}>Session 3</Text>
              <PieChartSvg width={180} data={data.talkTimeBySession[2].data} />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', gap: 20, paddingVertical: 20 }}>
          <View style={{ width: '50%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
              You skillfully opened up the room for participant and engagement
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', gap: 20 }}>
          <View style={{ width: '50%'}}>
            <Text style={{ fontSize: 10, textAlign: 'justify', marginBottom: 20 }}>
              No data
            </Text>
            <View style={styles.comparisonRow}>
              <View style={styles.pieColumn}>
                <InteractionChordPdf 
                  interactions={data.allSpeakerInteractions[0]?.interactions || [[0,0],[0,0]]} 
                  labels={data.allSpeakerInteractions[0]?.speakers || []} 
                  colors={colorsChord}
                  width={90}
                />
                <Text style={styles.chartTitle}>Session 1</Text>
              </View>
              <View style={styles.pieColumn}>
                <InteractionChordPdf 
                  interactions={data.allSpeakerInteractions[1]?.interactions || [[0,0],[0,0]]} 
                  labels={data.allSpeakerInteractions[1]?.speakers || []} 
                  colors={colorsChord}
                  width={90}
                />
                <Text style={styles.chartTitle}>Session 2</Text>
              </View>
            </View>
          </View>
          <View style={{width: '50%', alignItems: 'center'}}>
            <View style={styles.pieColumn}>
              <Text style={[styles.chartTitle, {textAlign: 'center'}]}>Session 3</Text>
              <InteractionChordPdf 
                interactions={data.allSpeakerInteractions[2]?.interactions || [[0,0],[0,0]]} 
                labels={data.allSpeakerInteractions[2]?.speakers || []} 
                colors={colorsChord}
                width={240}
              />
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 4 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>FOP Analysis</Text>

        <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20, alignItems: 'stretch' }}>
          <View style={{ width: '50%', borderRightWidth: 5, padding: 10, borderRightColor: '#F2561D' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 15}}>
              Your work on Emergent Scenario techniques evolved from individual concerns to exploring system-level complexity.
            </Text>
            <Text>
              No data
            </Text>
          </View>
          <View style={{ flex: 1, padding: 10, borderRadius: 4 }}>
            <Text style={{ fontWeight: 'bold'}}>
              No data
            </Text>
            <Text>
              No data
            </Text>
            <Text style={{ fontWeight: 'bold', marginTop: 20}}>
              No data
            </Text>
            <Text>
              No data
            </Text>
          </View>
        </View>

        <ProgressionLineChart progressionData={data.scenarioScoreProgression} />
        <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 15}}>
          You're seeing improvement in just 3 sessions- here's how you can continue.
        </Text>
        <GridAnalysis dataArray={data.marker_level_insights?.emergent_scenarios} />
      </Page>

      {/* PAGE 5 */}
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20, alignItems: 'stretch' }}>
          <View style={{ width: '50%', borderRightWidth: 5, padding: 10, borderRightColor: '#F2561D' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 15}}>
              You shifted from facilitator-led discussion to enabling more learner-driven inquiry.
            </Text>
            <Text>
              No data
            </Text>
          </View>
          <View style={{ flex: 1, padding: 10, borderRadius: 4 }}>
            <Text style={{ fontWeight: 'bold'}}>
              No data
            </Text>
            <Text>
              No data
            </Text>
            <Text style={{ fontWeight: 'bold', marginTop: 20}}>
              No data
            </Text>
            <Text>
              No data
            </Text>
          </View>
        </View>

        <ProgressionLineChart progressionData={data.dialogueScoreProgression} />
        <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 15}}>
          You're seeing improvement in just 3 sessions- here's how you can continue.
        </Text>
        <GridAnalysis dataArray={data.marker_level_insights?.generative_dialogue} />
      </Page>

      {/* PAGE 6 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Ease of use of FOP</Text>

        <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20, alignItems: 'stretch' }}>
          <View style={{ width: '50%', borderRightWidth: 5, padding: 10, borderRightColor: '#F2561D' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 15}}>
              You shifted from Easy to Regonised Complexity of what it takes to execute the FOP techniques.
            </Text>
          </View>
          <View style={{ flex: 1, padding: 10, borderRadius: 4 }}>
            <Text>
              Learner Engagement examines the extent to which learners are cognitively, emotionally, and socially invested in the learning process-beyond attendance or turn-taking. It focuses on sustained involvement, learner-initiated contributions, and moments where participants shape the direction, depth, or energy of the session.
            </Text>
          </View>
        </View>

        <EaseOfUseLineChart data={data.difficultyProgression} />

        <View style={easeOfUseStyles.legendRow}>
          {data.scenarioScoreProgression?.map((session, i) => (
            <View key={i} style={easeOfUseStyles.legendItem}>
              <View style={{
                width: 18, height: 18, borderRadius: 9,
                backgroundColor: ['#f59e0b', '#1e40af', '#e600ff'][i],
                borderWidth: 3,
                borderColor: ['#ffd287', '#4f64a8', '#eb7cf7'][i],
                marginRight: 6
              }} />
              <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{session.sessionLabel}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.subHeader, { paddingHorizontal: 40}]}>
          What this means for you
        </Text>
        <Text style={{borderLeftWidth: 5, borderLeftColor: '#F2561D', marginHorizontal: 40, paddingLeft: 20}}>
          No data
        </Text>
      </Page>
    </Document>
  );
};

export const PdfExportFinalReport = ({ exportData, user, journeyTimeline, difficultyProgression, allSpeakerInteractions, dialogueScoreProgression, scenarioScoreProgression, talkTimeBySession }: { exportData: any, user: any, journeyTimeline: any, difficultyProgression: any, allSpeakerInteractions: any, dialogueScoreProgression: any, scenarioScoreProgression: any, talkTimeBySession: any }) => {
  const finalData = {
    ...exportData,
    user: user,
    journeyTimeline,
    difficultyProgression,
    allSpeakerInteractions,
    dialogueScoreProgression,
    scenarioScoreProgression,
    talkTimeBySession
  }
  return (
    <PDFDownloadLink className='block' document={<ReportDocument data={finalData} />} fileName={`Final report ${user}.pdf`}>
      {({ loading }) => (
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
          <FileDown className="h-4 w-4 mr-3" />
          <span>{loading ? "Generating PDF..." : "Download PDF Final Report"}</span>
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PdfExportFinalReport;