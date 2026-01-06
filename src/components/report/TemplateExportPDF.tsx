import React from 'react';
import { 
  Document, Page, Text, View, StyleSheet, 
  Image, PDFDownloadLink, Canvas, Svg, Path, G, Polygon, Line, Circle,
} from '@react-pdf/renderer';
import { chord, ribbon, ChordGroup } from "d3-chord";
import { arc } from "d3-shape";
import { Button } from '../ui/button';
import { FileDown } from 'lucide-react';
import colors from 'tailwindcss/colors';
import { descending } from 'd3-array';
import { path as d3Path } from "d3-path";

const styles = StyleSheet.create({

  page: { 
    paddingTop: 40, 
    paddingBottom: 60, 
    paddingHorizontal: 40, 
    fontSize: 10, 
    fontFamily: 'Helvetica', 
    backgroundColor: '#fff' 
  },
  logo: { width: 240, marginBottom: 15 },
  headerContainer: { alignItems: 'flex-start', marginBottom: 8 },
  mainTitle: { fontSize: 15, fontWeight: 'bold', color: '#000', marginBottom: 8, textAlign: 'left' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#000', marginBottom: 8, marginTop: 15, textTransform: 'uppercase' },
  
  table: { 
    width: '100%', 
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRow: { 
    flexDirection: 'row', 
    alignItems: 'stretch', 
    minHeight: 30,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },

  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderTopWidth: 1, 
    borderTopColor: '#000',
  },
  firstRow: { borderTopWidth: 0 },
  lastRow: { borderBottomWidth: 0, borderTopWidth: 1 },
  tableColHeader: { width: '40%', padding: 6, fontWeight: 'bold', backgroundColor: '#f8fafc', borderRightWidth: 1, borderRightColor: '#000' },
  tableColValue: { width: '60%', padding: 6 },
  speakerColId: { width: '30%', padding: 6, fontWeight: 'bold', borderRightWidth: 1, borderRightColor: '#000' },
  speakerColDesc: { width: '70%', padding: 6, fontWeight: 'bold' },

  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    textAlign: 'center', 
    fontSize: 8, 
    color: '#94a3b8' 
  },

  themeContainer: {
    marginBottom: 15,
    padding: 10,
    wrap: false 
  },
  themeTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 5, textTransform: 'uppercase', color: '#000' },
  bulletRow: { flexDirection: 'row', marginBottom: 3, paddingLeft: 5 },
  bulletDot: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.4, textAlign: 'justify' }
});

const chartStyles = StyleSheet.create({
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 30 },
  chartContainer: { width: '48%', alignItems: 'center' },
  chartTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1e40af' },
  chartDescription: { fontSize: 9, color: '#475569', lineHeight: 1.5, textAlign: 'justify', marginTop: 20, backgroundColor: '#f8fafc', padding: 10, borderLeft: 2, borderLeftColor: '#1e40af' },
  legendContainer: { marginTop: 15, width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  legendColor: { width: 8, height: 8, marginRight: 5, borderRadius: 2 },
});

const PieChartSvg = ({ data }: { data: any[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = -Math.PI / 2; 

  return (
    <Svg viewBox="-120 -120 240 240" style={{ width: 250, height: 250 }}>
      {data.map((item, i) => {
        const fraction = item.value / total;
        const angle = fraction * 2 * Math.PI;
        
        const rOut = 120;
        const rIn = 50; 

        const x1 = rOut * Math.cos(cumulativeAngle);
        const y1 = rOut * Math.sin(cumulativeAngle);
        const x2 = rOut * Math.cos(cumulativeAngle + angle);
        const y2 = rOut * Math.sin(cumulativeAngle + angle);
        
        const x3 = rIn * Math.cos(cumulativeAngle + angle);
        const y3 = rIn * Math.sin(cumulativeAngle + angle);
        const x4 = rIn * Math.cos(cumulativeAngle);
        const y4 = rIn * Math.sin(cumulativeAngle);

        const largeArcFlag = fraction > 0.5 ? 1 : 0;

        const d = [
          `M ${x1} ${y1}`,
          `A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `L ${x3} ${y3}`,
          `A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
          `Z`
        ].join(' ');

        const midAngle = cumulativeAngle + angle / 2;
        const textR = (rOut + rIn) / 2;
        const textX = textR * Math.cos(midAngle);
        const textY = textR * Math.sin(midAngle);

        cumulativeAngle += angle;

        return (
          <G key={i}>
            <Path d={d} fill={item.color} stroke="#fff" strokeWidth={1} />
            
            {fraction > 0.05 && (
              <G>
                {wrapText(getSpeakerLabels(i, item.label), 15).map((line, lineIdx) => (
                  <Text
                    key={lineIdx}
                    x={textX}
                    y={textY - 5 + (lineIdx * 7)} 
                    fill="#fff"
                    style={{ fontSize: 7, fontWeight: "bold" }}
                    textAnchor="middle"
                  >
                    {line}
                  </Text>
                ))}
    
                <Text
                  x={textX}
                  y={textY + (wrapText(getSpeakerLabels(i, item.label), 10).length * 5)} 
                  fill="#fff"
                  style={{ fontSize: 7 }}
                  textAnchor="middle"
                >
                  {`${Math.round(fraction * 100)}%`}
                </Text>
              </G>
            )}
          </G>
        );
      })}
    </Svg>
  );
};


const BarChartView = ({ data }: { data: any[] }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  const yAxisTicks = [
    maxVal,
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0
  ];

  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{flexDirection: 'column', width: '100%', height: 280}}>
        <Text style={{ fontSize: 9, marginBottom: 5, textAlign: 'center', paddingBottom: 15 }}>Talk Time by Speakers (including silence)</Text>
        <View style={{ flexDirection: 'row' }}>
          {/* --- (Y-AXIS) --- */}
          <View style={{ 
            width: 40, 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            paddingRight: 5,
            paddingBottom: 20, 
          }}>
            {yAxisTicks.map((tick, index) => (
              <Text key={index} style={{ fontSize: 7, color: '#64748b' }}>
                {tick}
              </Text>
            ))}
          </View>


          <View style={{ 
            flex: 1, 
            flexDirection: 'row', 
            alignItems: 'flex-end', 
            borderLeftWidth: 1, 
            borderBottomWidth: 1, 
            borderColor: '#000',
            position: 'relative'
          }}>
            {[0.25, 0.5, 0.75].map((ratio) => (
              <View key={ratio} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${ratio * 100}%`,
                borderTopWidth: 0.5,
                borderTopColor: '#e2e8f0',
                zIndex: -1
              }} />
            ))}

            {data.map((item, i) => (
              <View 
                key={i} 
                style={{ 
                  flex: 1, 
                  alignItems: 'center', 
                  justifyContent: 'flex-end'
                }}
              >
                <View style={{ 
                  width: '70%', 
                  height: `${(item.value / maxVal) * 100}%`, 
                  backgroundColor: item.color,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3
                }} />
                
                {/* Label (ID Speaker) */}
                <View style={{ position: 'absolute', bottom: -20, width: '100%' }}>
                  <Text style={{ 
                    fontSize: 7, 
                    textAlign: 'center' 
                  }}>
                    {getSpeakerLabels(i, item.label)}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        </View>
      </View>
      <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 5 }}>
        <Text style={{ fontSize: 9 }}>Speakers</Text>
        {data.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: '4 8', borderRadius: 4 }}>
            <View style={{ width: 10, height: 10, backgroundColor: item.color, marginRight: 5, borderRadius: 2 }} />
            <Text style={{ fontSize: 9 }}>{getSpeakerLabels(i, item.label)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const InteractionChordPdf = ({ interactions, labels, colors }: { interactions: number[][], labels: string[], colors: string[] }) => {
  const outerRadius = 110;
  const innerRadius = outerRadius - 12;

  const chordGenerator = chord()
    .padAngle(0.05)
    .sortSubgroups(descending);
  const chords = chordGenerator(interactions);

  const arcGenerator = arc<ChordGroup>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const polar = (r: number, a: number) => [
    Math.sin(a) * r,
    -Math.cos(a) * r,
  ];

  const ribbonWithArrow = (c: any, r0: number) => {
    const { source, target } = c;
    const arrowLength = 12; 
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
    <Svg viewBox="-150 -150 300 300" style={{ width: 320, height: 320 }}>
      {chords.map((c, i) => {
        const pathData = ribbonWithArrow(c, innerRadius);
        const color = colors[c.source.index]; 
        return (
          <Path
            key={`ribbon-${i}`}
            d={pathData}
            fill={color}
            opacity={0.6}
            stroke={color}
            strokeWidth={0.5}
          />
        );
      })}

      {chords.groups.map((group, i) => {
        const pathData = arcGenerator(group);
        const angle = (group.startAngle + group.endAngle) / 2;
        const [lx, ly] = polar(outerRadius + 15, angle);

        return (
          <G key={`group-${i}`}>
            <Path
              d={pathData || ""}
              fill={colors[i]}
              stroke="#fff"
              strokeWidth={1}
            />
            <Text
              x={lx}
              y={ly}
              style={{ fontSize: 8, fill: "#333", textAnchor: "middle" }}
            >
              {labels[i]}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
};

const ScenarioRadarChart = ({ scores, maxScore = 4 }: { scores: any[], maxScore?: number }) => {
  const size = 300;
  const radius = 100;
  const centerX = 0;
  const centerY = 0;
  const angleStep = (Math.PI * 2) / scores.length;

  const getPoint = (score: number, index: number, r: number) => {
    const currentR = (score / maxScore) * r;
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: centerX + currentR * Math.cos(angle),
      y: centerY + currentR * Math.sin(angle)
    };
  };

  return (
    <Svg viewBox="-150 -150 300 300" style={{ width: "100%", height: 320 }}>
      {[1, 2, 3, 4].map((level) => {
        const points = scores.map((_, i) => {
          const p = getPoint(level, i, radius);
          return `${p.x},${p.y}`;
        }).join(' ');
        return (
          <Circle key={level} cx={0} cy={0} r={(level / maxScore) * radius} fill="none" stroke="#e2e8f0" strokeWidth={1} />
        );
      })}

      {scores.map((item, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelR = radius + 20; 
        const x = labelR * Math.cos(angle);
        const y = labelR * Math.sin(angle);

        const lines = wrapText(item.label, 15);
        const lineHeight = 8; 

        return (
          <G key={i}>
             <Line x1={0} y1={0} x2={getPoint(maxScore, i, radius).x} y2={getPoint(maxScore, i, radius).y} stroke="#cbd5e1" strokeWidth={1} />
             
             {lines.map((line, lineIdx) => (
               <Text
                 key={lineIdx}
                 x={x}
                 y={y + (lineIdx * lineHeight) - (lines.length * lineHeight / 2)}
                 style={{ fontSize: 7, fill: "#475569", textAnchor: "middle" }}
               >
                 {line}
               </Text>
             ))}
          </G>
        );
      })}

      <Polygon
        points={scores.map((item, i) => {
          const p = getPoint(item.score, i, radius);
          return `${p.x},${p.y}`;
        }).join(' ')}
        fill="#0d9488"
        fillOpacity={0.3}
        stroke="#0d9488"
        strokeWidth={2}
      />
      
      {scores.map((item, i) => {
        const p = getPoint(item.score, i, radius);
        return <Circle key={i} cx={p.x} cy={p.y} r={3} fill="#0d9488" />;
      })}
    </Svg>
  );
};

const generateColor = (twClass: string): string | null => {
  // match: text-red-500 | bg-red-500 | border-red-500
  const match = twClass.match(/-(\w+)-(\d+)/);
  if (!match) return null;

  const [, colorName, shade] = match;

  const color = (colors as any)[colorName]?.[shade];
  return color ?? null;
};

const wrapText = (text: string, maxChars: number) => {
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

const getRating = (score: number) => {
  switch (score) {
    case 4: return { text: 'Clearly Evident' };
    case 3: return { text: 'Visible' };
    case 2: return { text: 'Developing' };
    case 1: return { text: 'Minimally Evident' };
    case 0: return { text: 'Not Evident' };
  }
};

const getSpeakerLabels = (index: number, id: string) => {
  return id ? id : "Inaudible or Silent";
};

const ReportDocument = ({ data, labels, interactions }: { data: any, labels: any, interactions: any }) => {
  if (!data) return null;
  const chartData = data.talkTimeData.map((item: any) => ({
    label: item.speaker,
    value: item.seconds,
    color: generateColor(item.color),
  }));
  const totalTalkTime = chartData.reduce((a, b) => a + b.value, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds / 60);
    return `${mins}.${secs} minutes`;
  };

  return (
    <Document>
      {/* --- PAGE 1: SESSION & SPEAKERS --- */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerContainer}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.mainTitle}>FOP Analysis Session Report</Text>
        </View>

        <Text style={styles.sectionTitle}>Session Details</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow]}><Text style={[styles.tableColHeader, styles.tableCell]}>Use Site</Text><Text style={[styles.tableColValue, styles.tableCell]}>{data.useSite}</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableColHeader, styles.tableCell]}>File Name</Text><Text style={[styles.tableColValue, styles.tableCell]}>{data.filename}</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableColHeader, styles.tableCell]}>Session Date</Text><Text style={[styles.tableColValue, styles.tableCell]}>{data.sessionDate}</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableColHeader, styles.tableCell]}>Participants</Text><Text style={[styles.tableColValue, styles.tableCell]}>{data.participants}</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableColHeader, styles.tableCell]}>Session Type</Text><Text style={[styles.tableColValue, styles.tableCell]}>{data.sessionType}</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableColHeader, styles.tableCell]}>User Name</Text><Text style={[styles.tableColValue, styles.tableCell]}>Administrator</Text></View>
          <View style={[styles.tableRow]}><Text style={[styles.tableColHeader, styles.tableCell]}>Duration</Text><Text style={[styles.tableColValue, styles.tableCell]}>{formatDuration(data.totalTime)}</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Final Speaker Summary</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, {backgroundColor: "#4990e2"}]}>
            <Text style={[styles.speakerColId, styles.tableCell]}>Speaker ID</Text>
            <Text style={[styles.speakerColDesc, styles.tableCell]}>Description</Text>
          </View>
          {data.speakers && data.speakers.map((speaker: any, index: number) => (
            <View 
              key={index} 
              style={[styles.tableRow]}
              wrap={true}
            >
              <Text style={[styles.speakerColId, styles.tableCell]}>{getSpeakerLabels(index, speaker.id)}</Text>
              <Text style={[styles.speakerColDesc, styles.tableCell]}>{speaker.description}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* --- PAGE 2: MAIN DISCUSSION THEMES --- */}
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.sectionTitle}>Main Discussion Themes</Text>

        {data.themes && data.themes.map((theme: any, index: number) => (
          <View key={index} style={[styles.themeContainer, {borderBottomWidth: 1, borderBottomColor: '#000'}]} wrap={false}>
            <Text style={styles.themeTitle}>{theme.title}</Text>
            <Text style={{marginBottom: 5}}>{theme.description}</Text>
            {theme.bullets && theme.bullets.map((bullet: string, bIndex: number) => (
              <View key={bIndex} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        ))}

        {data.conclusions && (
          <View wrap={true}>
            <Text style={styles.sectionTitle}>Overall Conclusions</Text>
            <View style={{ padding: 8 }}>
              {data.conclusions.map((con: string, cIndex: number) => (
                <View key={cIndex} style={{ flexDirection: 'row', marginBottom: 5 }}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={{ flex: 1, textAlign: 'justify' }}>{con}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* --- PAGE 3: PIE CHART (TIME PERCENTAGE) --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Structural Analysis</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 20, justifyContent: 'flex-start', alignItems: 'flex-start' }]}>
            Talk Time Distribution by Speaker
          </Text>
          <Text style={{ fontSize: 9, textAlign: 'left', marginBottom: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            This chart breaks down the total learning session time by speaker. Each colored slice represents the percentage of
            time a specific person spoke. Larger slices indicate a greater share of talk time. The chart indicates who dominated
            the conversation and the overall balance of participation.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: 15, gap: 15 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ position: 'relative', width: 250, height: 250, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 9, marginBottom: 5 }}>Talk Time by Speakers (including silence)</Text>
                <PieChartSvg data={chartData} />
                
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                  <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>TOTAL</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1e40af' }}>
                    {Math.floor(totalTalkTime / 60)}m {totalTalkTime % 60}s
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 5 }}>
              <Text style={{ fontSize: 9 }}>Speakers</Text>
              {chartData.map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: '4 8', borderRadius: 4 }}>
                  <View style={{ width: 10, height: 10, backgroundColor: item.color, marginRight: 5, borderRadius: 2 }} />
                  <Text style={{ fontSize: 9 }}>{getSpeakerLabels(i, item.label)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* --- PAGE 4: BAR CHART (TALK TIME SECONDS) --- */}
      <Page size="A4" style={styles.page}>
        <View style={{ marginTop: 50, paddingHorizontal: 10 }}>
          <BarChartView data={chartData} />
        </View>
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* --- PAGE 5: INTERACTION CHORD DIAGRAM --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Speaker Interaction Chord Diagram</Text>
        </View>
        
        <Text style={{ fontSize: 9, color: '#64748b', marginBottom: 20 }}>
          This diagram visualizes the flow of conversation. Arc width is proportional to interaction frequency.
        </Text>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <InteractionChordPdf 
            interactions={interactions} 
            labels={labels} 
            colors={chartData.map(item => item.color)}  
          />
        </View>
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* --- PAGE 6: EMERGENT SCENARIOS --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Emergent Scenarios Detailed Analysis</Text>
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text>Emergent Scenario provided:</Text>
          <Text>Assess session for scenario</Text>
        </View>

        <View style={{ flex: 1, marginTop: 10, borderTopWidth: 1, borderTopColor: '#000', paddingTop: 10 }}>
          <Text style={[styles.mainTitle, {alignItems: 'flex-start', textAlign: 'left', justifyContent: 'flex-start'}]}>Score Visualization</Text>
          <View style={{ marginTop: 5 }}>
            <ScenarioRadarChart scores={data.scenarioScores} />
          </View>

          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 15, 
            marginTop: -10, 
            padding: 10, 
            backgroundColor: '#f8fafc', 
            borderRadius: 8,
            width: '100%' 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#0d9488' }}>Score scale:</Text>
              {[0, 1, 2, 3, 4].map((num) => (
                <Text style={{ fontSize: 8, color: '#64748b', marginLeft: 3 }} key={num}>{num} - {getRating(num).text} </Text>
              ))}
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Scores Summary</Text>
          
          <View style={[styles.table, { marginBottom: 20 }]}>
            <View style={[styles.tableRow, { backgroundColor: '#4990e2' }]}>
              <View style={[{ width: '34%', padding: 5, borderRightWidth: 1, borderRightColor: '#000' }, styles.tableCell]}>
                <Text style={{ fontWeight: 'bold' }}>Marker</Text>
              </View>
              <View style={[{ width: '33%', padding: 5, borderRightWidth: 1, borderRightColor: '#000', textAlign: 'center' }, styles.tableCell]}>
                <Text style={{ fontWeight: 'bold' }}>Score</Text>
              </View>
              <View style={[{ width: '33%', padding: 5, textAlign: 'center' }, styles.tableCell]}>
                <Text style={{ fontWeight: 'bold' }}>Rating</Text>
              </View>
            </View>

            {data.scenarioScores.map((item: any, index: number) => {
              const rating = getRating(item.score);
              return (
                <View 
                  key={index} 
                  style={[
                    styles.tableRow, 
                  ]}
                  wrap={false}
                >
                  <View style={[{ width: '34%', padding: 5, borderRightWidth: 1, borderRightColor: '#000' }, styles.tableCell]}>
                    <Text>{item.label}</Text>
                  </View>
                  <View style={[{ width: '33%', padding: 5, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center' }, styles.tableCell]}>
                    <Text style={{ fontWeight: 'bold' }}>{item.score}</Text>
                  </View>
                  <View style={[{ width: '33%', padding: 5, alignItems: 'center' }, styles.tableCell]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9 }}>
                      {rating.text}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* --- PAGE 7: DETAILED ANALYSIS --- */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Emergent Scenarios Detailed Analysis</Text>
        </View>

        {data.scenarioAnalysis && data.scenarioAnalysis.map((item: any, index: number) => (
          <View key={index} wrap={false}>
            <View>
              <Text style={styles.sectionTitle}>  
                {index + 1}. {item.title}
              </Text>
              <Text>
                <Text style={{fontWeight: 'bold'}}>Score:</Text> {item.score}
              </Text>
            </View>

            <View style={{paddingBottom: 30, marginBottom: 10, borderBottomWidth: 1}}>
              <Text style={{fontWeight: 'bold'}}>Analysis:</Text>
              <Text>
                {item.content}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Summary</Text>
        </View>

        <View style={{borderBottomWidth: 1, paddingBottom: 20, marginBottom: 10}}>
          <Text style={[styles.sectionTitle]}>Key Insights</Text>
          {data.esSummary && data.esSummary.keyInsights.map((point, i) => {
            return (
              <View key={i}>
                <Text>- {point.trim()}</Text>
              </View>
            );
          })}
        </View>

        <View>
          <Text style={[styles.sectionTitle]}>Recommendations</Text>
          {data.esSummary && data.esSummary.recommendations.map((point, i) => {
            return (
              <View key={i}>
                <Text>- {point.trim()}</Text>
              </View>
            );
          })}
        </View>        

        <Text 
          style={styles.footer} 
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
          fixed 
        />
      </Page>

      {/* --- PAGE 8: Generative Dialogue --- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Generative Dialogue Detailed Analysis</Text>
        </View>

        <View style={{ flex: 1, marginTop: 10, borderTopWidth: 1, borderTopColor: '#000', paddingTop: 10 }}>
          <Text style={[styles.mainTitle, {alignItems: 'flex-start'}]}>Score Visualization</Text>
          <View style={{ marginTop: 5 }}>
            <ScenarioRadarChart scores={data.dialogueScores} />
          </View>

          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 15, 
            marginTop: -10, 
            padding: 10, 
            backgroundColor: '#f8fafc', 
            borderRadius: 8,
            width: '100%' 
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#0d9488' }}>Score scale:</Text>
              {[0, 1, 2, 3, 4].map((num) => (
                <Text style={{ fontSize: 8, color: '#64748b', marginLeft: 3 }} key={num}>{num} - {getRating(num).text} </Text>
              ))}
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Scores Summary</Text>
          
          <View style={[styles.table, { marginBottom: 20 }]}>
            {/* Table Header */}
            <View style={[styles.tableRow, { backgroundColor: '#4990e2' }]}>
              <View style={[{ width: '34%', padding: 5, borderRightWidth: 1, borderRightColor: '#000' }, styles.tableCell]}>
                <Text style={{ fontWeight: 'bold' }}>Marker</Text>
              </View>
              <View style={[{ width: '33%', padding: 5, borderRightWidth: 1, borderRightColor: '#000', textAlign: 'center' }, styles.tableCell]}>
                <Text style={{ fontWeight: 'bold' }}>Score</Text>
              </View>
              <View style={[{ width: '33%', padding: 5, textAlign: 'center' }, styles.tableCell]}>
                <Text style={{ fontWeight: 'bold' }}>Rating</Text>
              </View>
            </View>

            {data.dialogueScores.map((item: any, index: number) => {
              const rating = getRating(item.score);
              return (
                <View 
                  key={index} 
                  style={[
                    styles.tableRow, 
                  ]}
                  wrap={false}
                >
                  <View style={[{ width: '34%', padding: 5, borderRightWidth: 1, borderRightColor: '#000' }, styles.tableCell]}>
                    <Text>{item.label}</Text>
                  </View>
                  <View style={[{ width: '33%', padding: 5, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center' }, styles.tableCell]}>
                    <Text style={{ fontWeight: 'bold' }}>{item.score}</Text>
                  </View>
                  <View style={[{ width: '33%', padding: 5, alignItems: 'center' }, styles.tableCell]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 9 }}>
                      {rating.text}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} fixed />
      </Page>

      {/* --- PAGE 9: DETAILED ANALYSIS --- */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Generative Dialogue Detailed Analysis</Text>
        </View>

        {data.dialogueAnalysis && data.dialogueAnalysis.map((item: any, index: number) => (
          <View key={index} wrap={false}>
            <View>
              <Text style={styles.sectionTitle}>
                {index + 1}. {item.title}
              </Text>
              <Text>
                <Text style={{fontWeight: 'bold'}}>Score:</Text> {item.score}
              </Text>
            </View>

            <View style={{paddingBottom: 10, marginBottom: 10 }}>
              <Text style={{fontWeight: 'bold'}}>Analysis:</Text>
              <Text>
                {item.content}
              </Text>
            </View>

            <View style={{paddingBottom: 30, marginBottom: 10, borderBottomWidth: 1 }}>
              <Text style={{fontWeight: 'bold', fontSize: 12, marginBottom: 10, fontStyle: 'italic'}}>Opportunities:</Text>
              {item?.opportunity.map((oppo: any) => (
                <View style={{marginBottom: 10, flexWrap: 'wrap' }}>
                  <Text>
                    <Text style={{ fontWeight: '600' }}>Speaker: </Text>
                    {oppo.speaker}
                  </Text>

                  <Text>
                    <Text style={{ fontWeight: '600' }}>Quote: </Text>
                    {oppo.quote}
                  </Text>

                  <Text>
                    <Text style={{ fontWeight: '600' }}>Observation: </Text>
                    {oppo.observation}
                  </Text>

                  <Text>
                    <Text style={{ fontWeight: '600' }}>Opportunity: </Text>
                    {oppo.opportunity}
                  </Text>                 
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.headerContainer}>
          <Text style={styles.mainTitle}>Summary</Text>
        </View>

        <View style={{borderBottomWidth: 1, paddingBottom: 30, marginBottom: 10}}>
          <Text style={[styles.sectionTitle]}>Key Insights</Text>
          {data.gdSummary && data.gdSummary.keyInsights.map((point, i) => {
            return (
              <View key={i}>
                <Text>- {point.trim()}</Text>
              </View>
            );
          })}
        </View>

        <View>
          <Text style={[styles.sectionTitle]}>Recommendations</Text>
          {data.gdSummary && data.gdSummary.recommendations.map((point, i) => {
            return (
              <View key={i}>
                <Text>- {point.trim()}</Text>
              </View>
            );
          })}
        </View>

        <Text 
          style={styles.footer} 
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
          fixed 
        />
      </Page>
    </Document>
  );
};

export const PdfExportFeature = ({ exportData, labels, interactions }: { exportData: any, labels: any, interactions: any }) => {
  return (
    <PDFDownloadLink className='block' document={<ReportDocument data={exportData} labels={labels} interactions={interactions} />} fileName="FOP Analysis Session Report.pdf">
      {({ loading }) => (
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          
        >
          <FileDown className="h-4 w-4 mr-3" />
          <span>{loading ? "Generating PDF..." : "Download PDF Report"}</span>
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PdfExportFeature;