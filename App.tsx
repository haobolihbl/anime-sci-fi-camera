import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Project = {
  id: string;
  title: string;
  genre: string;
  words: string;
  updated: string;
  progress: number;
  accent: string;
};

const projects: Project[] = [
  { id: '1', title: '轮回失格', genre: '无限流 · 规则怪谈', words: '0.7万字', updated: '正在创作第 2 章', progress: 11, accent: '#6B2737' },
  { id: '2', title: '七号教学楼', genre: '第一副本 · 章节大纲', words: '6-7万字', updated: '章节规划 30 章', progress: 18, accent: '#3F4A59' },
];

const tools = [
  { icon: '1', label: '写第二章', color: '#8067F2', bg: '#EEEAFE' },
  { icon: '2', label: '补30章大纲', color: '#2690C3', bg: '#E1F4FC' },
  { icon: '3', label: '苏晚晴人物弧', color: '#D87F2D', bg: '#FFF1DF' },
  { icon: '4', label: '章节质检表', color: '#3B9B73', bg: '#E5F6ED' },
];

function App() {
  const [activeTab, setActiveTab] = useState('创作');
  const [selectedProject, setSelectedProject] = useState('1');
  const [targetWords, setTargetWords] = useState(2200);
  const todayWords = 1268;
  const targetPercent = useMemo(
    () => Math.min(100, Math.round((todayWords / targetWords) * 100)),
    [targetWords],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7FC" />
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>墨境 · STORY STUDIO</Text>
            <Text style={styles.greeting}>下午好，创作者</Text>
          </View>
          <Pressable style={styles.avatar} accessibilityLabel="打开个人中心">
            <Text style={styles.avatarText}>墨</Text>
            <View style={styles.onlineDot} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlowOne} />
            <View style={styles.heroGlowTwo} />
            <Text style={styles.heroKicker}>✦ 让好故事自然发生</Text>
            <Text style={styles.heroTitle}>从《轮回失格》，{`\n`}到可连载章节</Text>
            <Text style={styles.heroBody}>主角秦川，第一副本《七号教学楼》；章节按 2000-2500 字拆分，目标 2200 字。</Text>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>继续第 2 章</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>创作工具</Text>
            <Text style={styles.sectionHint}>接下来先选一步</Text>
          </View>
          <View style={styles.toolGrid}>
            {tools.map(tool => (
              <Pressable key={tool.label} style={styles.toolCard}>
                <View style={[styles.toolIcon, { backgroundColor: tool.bg }]}>
                  <Text style={[styles.toolIconText, { color: tool.color }]}>{tool.icon}</Text>
                </View>
                <Text style={styles.toolLabel}>{tool.label}</Text>
                <Text style={styles.toolArrow}>›</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的作品</Text>
            <Pressable><Text style={styles.link}>全部作品  ›</Text></Pressable>
          </View>
          {projects.map(project => {
            const selected = project.id === selectedProject;
            return (
              <Pressable
                key={project.id}
                onPress={() => setSelectedProject(project.id)}
                style={[styles.projectCard, selected && styles.projectCardSelected]}>
                <View style={[styles.bookCover, { backgroundColor: project.accent }]}>
                  <Text style={styles.bookMark}>墨境出品</Text>
                  <View style={styles.bookLine} />
                  <Text numberOfLines={2} style={styles.bookTitle}>{project.title}</Text>
                </View>
                <View style={styles.projectInfo}>
                  <View style={styles.projectTitleRow}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Text style={styles.projectMore}>•••</Text>
                  </View>
                  <Text style={styles.projectMeta}>{project.genre} · {project.words}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
                  </View>
                  <Text style={styles.updated}>{project.updated}</Text>
                </View>
                {selected && (
                  <Pressable style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>续写</Text>
                  </Pressable>
                )}
              </Pressable>
            );
          })}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日创作</Text>
            <Text style={styles.streak}>🔥 连续 7 天</Text>
          </View>
          <View style={styles.dailyCard}>
            <View style={styles.dailyTop}>
              <View>
                <Text style={styles.dailyLabel}>今日已写</Text>
                <Text style={styles.dailyNumber}>{todayWords.toLocaleString()}<Text style={styles.dailyUnit}> 字</Text></Text>
              </View>
              <View style={styles.targetWrap}>
                <Text style={styles.targetLabel}>目标</Text>
                <TextInput
                  accessibilityLabel="每日字数目标"
                  keyboardType="number-pad"
                  onChangeText={value => setTargetWords(Number(value) || 1)}
                  style={styles.targetInput}
                  value={String(targetWords)}
                />
                <Text style={styles.targetLabel}>字</Text>
              </View>
            </View>
            <View style={styles.dailyTrack}>
              <View style={[styles.dailyFill, { width: `${targetPercent}%` }]} />
            </View>
            <Text style={styles.encouragement}>已完成 {targetPercent}%，再写 {Math.max(0, targetWords - todayWords)} 字就达成今日目标</Text>
          </View>
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.tabBar}>
          {[['⌂', '创作'], ['▣', '书架'], ['✦', '成长'], ['◉', '我的']].map(([icon, label]) => {
            const active = activeTab === label;
            return (
              <Pressable key={label} onPress={() => setActiveTab(label)} style={styles.tabItem}>
                <Text style={[styles.tabIcon, active && styles.tabActive]}>{icon}</Text>
                <Text style={[styles.tabLabel, active && styles.tabActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F7FC' },
  appShell: { flex: 1, backgroundColor: '#F8F7FC' },
  header: { height: 84, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: '#786EA0', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 5 },
  greeting: { color: '#211D2D', fontSize: 21, fontWeight: '800', letterSpacing: -0.4 },
  avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#E8E2FA', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#6653C4', fontSize: 17, fontWeight: '800' },
  onlineDot: { position: 'absolute', right: -1, bottom: 1, width: 11, height: 11, borderRadius: 6, backgroundColor: '#46B982', borderWidth: 2, borderColor: '#F8F7FC' },
  scrollContent: { paddingHorizontal: 18 },
  heroCard: { minHeight: 224, padding: 22, borderRadius: 26, backgroundColor: '#302752', overflow: 'hidden' },
  heroGlowOne: { position: 'absolute', width: 220, height: 220, borderRadius: 110, right: -60, top: -70, backgroundColor: '#59458B' },
  heroGlowTwo: { position: 'absolute', width: 140, height: 140, borderRadius: 70, right: 15, bottom: -80, backgroundColor: '#7861AD', opacity: 0.55 },
  heroKicker: { color: '#D7C9FF', fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginBottom: 11 },
  heroTitle: { color: '#FFFFFF', fontSize: 28, lineHeight: 37, fontWeight: '900', letterSpacing: -0.8 },
  heroBody: { width: '72%', color: '#CBC3DE', fontSize: 12, lineHeight: 19, marginTop: 8 },
  primaryButton: { alignSelf: 'flex-start', marginTop: 17, paddingHorizontal: 17, height: 38, borderRadius: 12, backgroundColor: '#F4F0FF', justifyContent: 'center' },
  primaryButtonText: { color: '#4D3B85', fontSize: 13, fontWeight: '800' },
  sectionHeader: { marginTop: 25, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: '#282332', fontSize: 17, fontWeight: '800' },
  sectionHint: { color: '#9993A6', fontSize: 11 },
  link: { color: '#7562C1', fontSize: 12, fontWeight: '600' },
  toolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toolCard: { width: '48.5%', height: 70, flexDirection: 'row', alignItems: 'center', borderRadius: 18, paddingHorizontal: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEEAF3' },
  toolIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  toolIconText: { fontSize: 19, fontWeight: '800' },
  toolLabel: { flex: 1, color: '#393443', fontSize: 13, fontWeight: '700' },
  toolArrow: { color: '#B8B2BF', fontSize: 19 },
  projectCard: { minHeight: 110, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 11, marginBottom: 10, borderWidth: 1, borderColor: '#EEEAF3' },
  projectCardSelected: { borderColor: '#D6CBFF', shadowColor: '#5B439D', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  bookCover: { width: 64, height: 86, borderRadius: 10, padding: 8, justifyContent: 'space-between', overflow: 'hidden' },
  bookMark: { color: '#FFFFFF', opacity: 0.7, fontSize: 8, fontWeight: '700' },
  bookLine: { position: 'absolute', right: -20, top: 28, width: 85, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', transform: [{ rotate: '-28deg' }] },
  bookTitle: { color: '#FFFFFF', fontSize: 13, lineHeight: 17, fontWeight: '800' },
  projectInfo: { flex: 1, alignSelf: 'stretch', justifyContent: 'center', marginLeft: 13 },
  projectTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectTitle: { color: '#2A2632', fontSize: 15, fontWeight: '800' },
  projectMore: { color: '#B3ADB9', fontSize: 12, letterSpacing: 1 },
  projectMeta: { color: '#8E8797', fontSize: 11, marginTop: 6 },
  progressTrack: { marginTop: 10, width: '72%', height: 4, backgroundColor: '#EEEAF3', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: '#8A72E6', borderRadius: 3 },
  updated: { color: '#AAA4AF', fontSize: 9, marginTop: 6 },
  continueButton: { position: 'absolute', right: 12, bottom: 12, backgroundColor: '#EFEAFE', paddingHorizontal: 13, paddingVertical: 7, borderRadius: 10 },
  continueButtonText: { color: '#6852C4', fontSize: 11, fontWeight: '800' },
  streak: { color: '#D16C3D', backgroundColor: '#FFF0E7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, fontSize: 10, fontWeight: '700' },
  dailyCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 17, borderWidth: 1, borderColor: '#EEEAF3' },
  dailyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dailyLabel: { color: '#8E8797', fontSize: 11, marginBottom: 3 },
  dailyNumber: { color: '#302A3B', fontSize: 24, fontWeight: '900' },
  dailyUnit: { color: '#777181', fontSize: 11, fontWeight: '500' },
  targetWrap: { flexDirection: 'row', alignItems: 'center' },
  targetLabel: { color: '#9A94A1', fontSize: 10 },
  targetInput: { color: '#6254A7', fontSize: 12, fontWeight: '700', textAlign: 'center', minWidth: 42, paddingVertical: 3, marginHorizontal: 4, backgroundColor: '#F2EFFB', borderRadius: 7 },
  dailyTrack: { marginTop: 14, height: 7, backgroundColor: '#EEEAF5', borderRadius: 5, overflow: 'hidden' },
  dailyFill: { height: 7, borderRadius: 5, backgroundColor: '#8068D5' },
  encouragement: { color: '#8B8492', fontSize: 10, marginTop: 9 },
  bottomSpacer: { height: 30 },
  tabBar: { height: 72, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#ECE8F1', paddingBottom: 4 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon: { color: '#AAA4B0', fontSize: 20, fontWeight: '600' },
  tabLabel: { color: '#AAA4B0', fontSize: 10, fontWeight: '600' },
  tabActive: { color: '#6B55C6' },
});

export default App;
