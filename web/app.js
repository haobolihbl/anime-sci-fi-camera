const STORAGE_KEY = 'mojing.workspace.v1';
const STATUS_LABELS = {draft: '草稿', revising: '修改中', done: '已完成'};

const $ = selector => document.querySelector(selector);
const elements = {
  saveState: $('#saveState'),
  projectSelect: $('#projectSelect'),
  chapterCount: $('#chapterCount'),
  chapterList: $('#chapterList'),
  projectPath: $('#projectPath'),
  chapterPath: $('#chapterPath'),
  chapterStatus: $('#chapterStatus'),
  chapterTitle: $('#chapterTitle'),
  chapterBody: $('#chapterBody'),
  wordCount: $('#wordCount'),
  updatedAt: $('#updatedAt'),
  writeView: $('#writeView'),
  outlineView: $('#outlineView'),
  projectProgress: $('#projectProgress'),
  projectTitle: $('#projectTitle'),
  projectGenre: $('#projectGenre'),
  projectHook: $('#projectHook'),
  projectSynopsis: $('#projectSynopsis'),
  outlineChapterTitle: $('#outlineChapterTitle'),
  outlineChapterStatus: $('#outlineChapterStatus'),
  chapterGoal: $('#chapterGoal'),
  chapterOutline: $('#chapterOutline'),
  goalCurrent: $('#goalCurrent'),
  chapterTarget: $('#chapterTarget'),
  goalBar: $('#goalBar'),
  goalHint: $('#goalHint'),
  outlineGlanceText: $('#outlineGlanceText'),
  nameDialog: $('#nameDialog'),
  dialogEyebrow: $('#dialogEyebrow'),
  dialogTitle: $('#dialogTitle'),
  dialogLabel: $('#dialogLabel'),
  dialogInput: $('#dialogInput'),
  dialogError: $('#dialogError'),
  toast: $('#toast'),
  importFile: $('#importFile'),
};

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function demoState() {
  const now = new Date().toISOString();
  const projectId = uid('project');
  const chapters = [
    {
      id: uid('chapter'),
      title: '第 1 章 门口的尸体',
      status: 'done',
      body: '秦川第三次睁眼时，自己的尸体正挂在教室门口。\n\n走廊里的灯坏了两盏。那具尸体垂着头，鞋尖离地半尺，校服口袋里却响起一阵手机铃声。\n\n秦川低头看向自己手里。屏幕上只有四个字：\n\n来电人，秦川。',
      goal: '完成副本开场，亮出死亡循环能力，并以诡异来电收尾。',
      outline: '秦川第三次从教室醒来，看见自己的尸体挂在门外。\n确认同批六名玩家仍在，但各自反应与前两次不同。\n他在尸体口袋里听见手机铃声，自己的手机同时亮起。\n章末：来电人显示“秦川”。',
      target: 2200,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid('chapter'),
      title: '第 2 章 第三次了',
      status: 'draft',
      body: '',
      goal: '接起来电，让红校服女生首次现身，并埋下“不要相信苏晚晴”的信息差。',
      outline: '秦川接通电话，听见两次循环前的自己留下警告。\n教室门外出现红校服女生，其他玩家却看不见她。\n苏晚晴主动提出查看尸体。\n章末：电话里的秦川说——不要相信苏晚晴。',
      target: 2200,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid('chapter'),
      title: '第 3 章 不存在的第七人',
      status: 'draft',
      body: '',
      goal: '让秦川发现人数错误，把玩家之间的不信任推到台前。',
      outline: '点名册只有六人，教室里却有七个活人。\n众人互证身份，秦川利用前两次循环留下的信息排除三人。\n章末：多出来的人说出了只有秦川知道的死亡细节。',
      target: 2200,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid('chapter'),
      title: '第 4 章 苏晚晴的座位',
      status: 'draft',
      body: '',
      goal: '第一次尝试改变副本角色的既定命运。',
      outline: '秦川确认苏晚晴每轮都会死在同一张座位旁。\n他决定主动改变她的行动路线。\n改变规则触发新的代价，副本开始针对秦川修正。',
      target: 2200,
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    version: 1,
    activeProjectId: projectId,
    activeChapterId: chapters[1].id,
    activeView: 'write',
    projects: [{
      id: projectId,
      title: '轮回失格',
      genre: '悬疑无限流 / 规则怪谈 / 智斗群像',
      hook: '秦川每次死亡都会回到副本开局，却在一次次重启中失去回到现实的资格。',
      synopsis: '秦川进入七号教学楼后获得死亡重开的能力。每次重开，他都会保留疼痛、记忆和精神污染；若改变副本角色的命运，对方会脱离既定轨道，成为拥有循环记忆的同伴。\n\n第一卷围绕七号教学楼展开：查清循环源头、救下苏晚晴，并揭开秦川可能早已属于副本的线索。',
      createdAt: now,
      updatedAt: now,
      chapters,
    }],
  };
}

function blankChapter(title) {
  const now = new Date().toISOString();
  return {id: uid('chapter'), title, status: 'draft', body: '', goal: '', outline: '', target: 2200, createdAt: now, updatedAt: now};
}

function clampTarget(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 2200;
  return Math.min(20000, Math.max(100, Math.round(parsed)));
}

function normalizeState(candidate) {
  if (!candidate || !Array.isArray(candidate.projects) || candidate.projects.length === 0) return null;
  const projects = candidate.projects.map(project => ({
    id: String(project.id || uid('project')),
    title: String(project.title || '未命名作品'),
    genre: String(project.genre || ''),
    hook: String(project.hook || ''),
    synopsis: String(project.synopsis || ''),
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString(),
    chapters: Array.isArray(project.chapters) && project.chapters.length
      ? project.chapters.map(chapter => ({
        id: String(chapter.id || uid('chapter')),
        title: String(chapter.title || '未命名章节'),
        status: STATUS_LABELS[chapter.status] ? chapter.status : 'draft',
        body: String(chapter.body || ''),
        goal: String(chapter.goal || ''),
        outline: String(chapter.outline || ''),
        target: clampTarget(chapter.target),
        createdAt: chapter.createdAt || new Date().toISOString(),
        updatedAt: chapter.updatedAt || new Date().toISOString(),
      }))
      : [blankChapter('第 1 章')],
  }));

  const selectedProject = projects.find(project => project.id === candidate.activeProjectId) || projects[0];
  const selectedChapter = selectedProject.chapters.find(chapter => chapter.id === candidate.activeChapterId) || selectedProject.chapters[0];
  return {
    version: 1,
    activeProjectId: selectedProject.id,
    activeChapterId: selectedChapter.id,
    activeView: candidate.activeView === 'outline' ? 'outline' : 'write',
    projects,
  };
}

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeState(JSON.parse(stored)) || demoState();
  } catch (error) {
    console.warn('无法读取本地创作数据：', error);
  }
  return demoState();
}

let state = loadState();
let saveTimer;
let toastTimer;
let dialogAction = null;

function activeProject() {
  return state.projects.find(project => project.id === state.activeProjectId) || state.projects[0];
}

function activeChapter() {
  const project = activeProject();
  return project.chapters.find(chapter => chapter.id === state.activeChapterId) || project.chapters[0];
}

function countWords(text) {
  const matches = String(text || '').match(/[\u3400-\u4dbf\u4e00-\u9fff]|[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g);
  return matches ? matches.length : 0;
}

function formatTime(value) {
  if (!value) return '尚未编辑';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '尚未编辑';
  return `更新于 ${date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})}`;
}

function queueSave({immediate = false} = {}) {
  elements.saveState.classList.add('saving');
  elements.saveState.innerHTML = '<i></i>正在保存…';
  clearTimeout(saveTimer);
  if (immediate) return persistState();
  saveTimer = setTimeout(persistState, 320);
}

function persistState() {
  clearTimeout(saveTimer);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    elements.saveState.classList.remove('saving', 'error');
    elements.saveState.innerHTML = '<i></i>已自动保存';
  } catch (error) {
    elements.saveState.classList.remove('saving');
    elements.saveState.classList.add('error');
    elements.saveState.innerHTML = '<i></i>保存失败，请立即备份';
    console.error('无法保存创作数据：', error);
  }
}

function touchChapter(chapter) {
  const now = new Date().toISOString();
  chapter.updatedAt = now;
  activeProject().updatedAt = now;
}

function chapterListMarkup() {
  const project = activeProject();
  const chapter = activeChapter();
  return project.chapters.map((item, index) => {
    const words = countWords(item.body);
    const active = item.id === chapter.id ? ' class="active"' : '';
    return `<li${active}><button type="button" data-chapter-id="${escapeHtml(item.id)}"><span>${String(index + 1).padStart(2, '0')}</span><div><b>${escapeHtml(item.title)}</b><small>${STATUS_LABELS[item.status]} · ${words.toLocaleString('zh-CN')} 字</small></div></button></li>`;
  }).join('');
}

function render() {
  const project = activeProject();
  const chapter = activeChapter();

  elements.projectSelect.innerHTML = state.projects
    .map(item => `<option value="${escapeHtml(item.id)}"${item.id === project.id ? ' selected' : ''}>《${escapeHtml(item.title)}》</option>`)
    .join('');
  elements.chapterCount.textContent = `${project.chapters.length} 章`;
  elements.chapterList.innerHTML = chapterListMarkup();
  elements.projectPath.textContent = `《${project.title}》`;
  elements.chapterPath.textContent = chapter.title;
  elements.chapterStatus.value = chapter.status;
  elements.chapterTitle.value = chapter.title;
  elements.chapterBody.value = chapter.body;
  elements.updatedAt.textContent = formatTime(chapter.updatedAt);

  elements.projectTitle.value = project.title;
  elements.projectGenre.value = project.genre;
  elements.projectHook.value = project.hook;
  elements.projectSynopsis.value = project.synopsis;
  elements.outlineChapterTitle.textContent = chapter.title;
  elements.outlineChapterStatus.textContent = STATUS_LABELS[chapter.status];
  elements.chapterGoal.value = chapter.goal;
  elements.chapterOutline.value = chapter.outline;

  const done = project.chapters.filter(item => item.status === 'done').length;
  elements.projectProgress.textContent = `${done} / ${project.chapters.length} 章完成`;
  elements.chapterTarget.value = chapter.target;
  elements.outlineGlanceText.textContent = chapter.outline.trim() || '还没有本章提要。先写一句，明确本章的冲突和章末钩子。';
  switchView(state.activeView, {save: false});
  updateProgress();
}

function renderChapterList() {
  elements.chapterList.innerHTML = chapterListMarkup();
}

function updateProgress() {
  const chapter = activeChapter();
  const words = countWords(chapter.body);
  const target = clampTarget(chapter.target);
  const remaining = Math.max(0, target - words);
  const percent = Math.min(100, Math.round(words / target * 100));
  elements.wordCount.textContent = words.toLocaleString('zh-CN');
  elements.goalCurrent.textContent = words.toLocaleString('zh-CN');
  elements.goalBar.style.width = `${percent}%`;
  elements.goalHint.textContent = remaining > 0 ? `还差 ${remaining.toLocaleString('zh-CN')} 字达到目标` : `已达到目标，完成度 ${percent}%`;
}

function switchView(view, {save = true} = {}) {
  state.activeView = view === 'outline' ? 'outline' : 'write';
  elements.writeView.hidden = state.activeView !== 'write';
  elements.outlineView.hidden = state.activeView !== 'outline';
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === state.activeView));
  if (save) queueSave();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2600);
}

function openNameDialog(type) {
  dialogAction = type;
  elements.dialogError.textContent = '';
  elements.dialogInput.value = '';
  const isProject = type === 'project';
  elements.dialogEyebrow.textContent = isProject ? '新作品' : `《${activeProject().title}》`;
  elements.dialogTitle.textContent = isProject ? '创建一部新作品' : '新建章节';
  elements.dialogLabel.textContent = isProject ? '作品名' : '章节标题';
  elements.dialogInput.placeholder = isProject ? '例如：客中' : `例如：第 ${activeProject().chapters.length + 1} 章 回声`;
  elements.nameDialog.showModal();
  setTimeout(() => elements.dialogInput.focus(), 0);
}

function createNamedItem(name) {
  const cleanName = name.trim();
  if (!cleanName) return false;
  const now = new Date().toISOString();

  if (dialogAction === 'project') {
    const chapter = blankChapter('第 1 章');
    const project = {id: uid('project'), title: cleanName, genre: '', hook: '', synopsis: '', createdAt: now, updatedAt: now, chapters: [chapter]};
    state.projects.push(project);
    state.activeProjectId = project.id;
    state.activeChapterId = chapter.id;
    state.activeView = 'outline';
    showToast(`已创建《${cleanName}》`);
  } else {
    const chapter = blankChapter(cleanName);
    activeProject().chapters.push(chapter);
    state.activeChapterId = chapter.id;
    state.activeView = 'write';
    showToast(`已创建“${cleanName}”`);
  }
  queueSave({immediate: true});
  render();
  return true;
}

function deleteCurrentChapter() {
  const project = activeProject();
  const chapter = activeChapter();
  if (project.chapters.length === 1) {
    showToast('每部作品至少保留一个章节');
    return;
  }
  if (!window.confirm(`确定删除“${chapter.title}”吗？此操作无法撤销。`)) return;
  const index = project.chapters.findIndex(item => item.id === chapter.id);
  project.chapters.splice(index, 1);
  state.activeChapterId = project.chapters[Math.max(0, index - 1)].id;
  queueSave({immediate: true});
  render();
  showToast('章节已删除');
}

function deleteCurrentProject() {
  const project = activeProject();
  if (state.projects.length === 1) {
    showToast('至少保留一部作品，可新建作品后再删除');
    return;
  }
  if (!window.confirm(`确定删除《${project.title}》及其全部章节吗？此操作无法撤销。`)) return;
  state.projects = state.projects.filter(item => item.id !== project.id);
  state.activeProjectId = state.projects[0].id;
  state.activeChapterId = state.projects[0].chapters[0].id;
  queueSave({immediate: true});
  render();
  showToast('作品已删除');
}

function downloadText(filename, text, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], {type});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeFilename(name) {
  return name.replace(/[\\/:*?"<>|]/g, '-').trim() || '未命名作品';
}

function exportMarkdown() {
  const project = activeProject();
  const sections = [`# ${project.title}`, '', project.genre && `> ${project.genre}`, project.hook && `**核心钩子：** ${project.hook}`, project.synopsis && `## 故事总纲\n\n${project.synopsis}`]
    .filter(Boolean);
  project.chapters.forEach(chapter => sections.push(`## ${chapter.title}`, '', chapter.body || '（本章尚未写作）'));
  downloadText(`${safeFilename(project.title)}-正文.md`, sections.join('\n\n'), 'text/markdown;charset=utf-8');
  showToast('正文已导出为 Markdown');
}

function backupProject() {
  const project = activeProject();
  const backup = {format: 'mojing-project', version: 1, exportedAt: new Date().toISOString(), project};
  downloadText(`${safeFilename(project.title)}-墨境备份.json`, JSON.stringify(backup, null, 2), 'application/json;charset=utf-8');
  showToast('项目备份已下载');
}

async function importProject(file) {
  try {
    const parsed = JSON.parse(await file.text());
    const sourceProject = parsed && parsed.format === 'mojing-project' ? parsed.project : parsed;
    const normalized = normalizeState({projects: [sourceProject], activeProjectId: sourceProject && sourceProject.id, activeChapterId: sourceProject && sourceProject.chapters && sourceProject.chapters[0] && sourceProject.chapters[0].id});
    if (!normalized) throw new Error('invalid-project');
    const project = normalized.projects[0];
    project.id = uid('project');
    project.title = state.projects.some(item => item.title === project.title) ? `${project.title}（导入）` : project.title;
    project.chapters.forEach(chapter => { chapter.id = uid('chapter'); });
    state.projects.push(project);
    state.activeProjectId = project.id;
    state.activeChapterId = project.chapters[0].id;
    queueSave({immediate: true});
    render();
    showToast(`已导入《${project.title}》`);
  } catch (error) {
    showToast('导入失败：请选择由墨境导出的项目备份');
  } finally {
    elements.importFile.value = '';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character]));
}

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
$('#editOutline').addEventListener('click', () => switchView('outline'));
$('#newProject').addEventListener('click', () => openNameDialog('project'));
$('#newChapter').addEventListener('click', () => openNameDialog('chapter'));
$('#newChapterTop').addEventListener('click', () => openNameDialog('chapter'));
$('#deleteChapter').addEventListener('click', deleteCurrentChapter);
$('#deleteProject').addEventListener('click', deleteCurrentProject);
$('#exportMarkdown').addEventListener('click', exportMarkdown);
$('#backupProject').addEventListener('click', backupProject);
$('#importProject').addEventListener('click', () => elements.importFile.click());
elements.importFile.addEventListener('change', event => event.target.files[0] && importProject(event.target.files[0]));

elements.nameDialog.addEventListener('close', () => {
  if (elements.nameDialog.returnValue !== 'confirm') return;
  if (!createNamedItem(elements.dialogInput.value)) {
    elements.dialogError.textContent = '请输入名称后再创建。';
    elements.nameDialog.showModal();
    setTimeout(() => elements.dialogInput.focus(), 0);
  }
});

elements.projectSelect.addEventListener('change', event => {
  state.activeProjectId = event.target.value;
  state.activeChapterId = activeProject().chapters[0].id;
  queueSave({immediate: true});
  render();
});

elements.chapterList.addEventListener('click', event => {
  const button = event.target.closest('[data-chapter-id]');
  if (!button) return;
  state.activeChapterId = button.dataset.chapterId;
  queueSave({immediate: true});
  render();
});

elements.chapterTitle.addEventListener('input', event => {
  const chapter = activeChapter();
  chapter.title = event.target.value;
  touchChapter(chapter);
  elements.chapterPath.textContent = chapter.title || '未命名章节';
  elements.outlineChapterTitle.textContent = chapter.title || '未命名章节';
  renderChapterList();
  elements.updatedAt.textContent = formatTime(chapter.updatedAt);
  queueSave();
});

elements.chapterBody.addEventListener('input', event => {
  const chapter = activeChapter();
  chapter.body = event.target.value;
  touchChapter(chapter);
  updateProgress();
  renderChapterList();
  elements.updatedAt.textContent = formatTime(chapter.updatedAt);
  queueSave();
});

elements.chapterStatus.addEventListener('change', event => {
  const chapter = activeChapter();
  chapter.status = event.target.value;
  touchChapter(chapter);
  elements.outlineChapterStatus.textContent = STATUS_LABELS[chapter.status];
  renderChapterList();
  const project = activeProject();
  elements.projectProgress.textContent = `${project.chapters.filter(item => item.status === 'done').length} / ${project.chapters.length} 章完成`;
  queueSave();
});

[
  [elements.projectTitle, 'title'],
  [elements.projectGenre, 'genre'],
  [elements.projectHook, 'hook'],
  [elements.projectSynopsis, 'synopsis'],
].forEach(([element, field]) => element.addEventListener('input', event => {
  const project = activeProject();
  project[field] = event.target.value;
  project.updatedAt = new Date().toISOString();
  if (field === 'title') {
    elements.projectPath.textContent = `《${project.title || '未命名作品'}》`;
    const option = Array.from(elements.projectSelect.options).find(item => item.value === project.id);
    if (option) option.textContent = `《${project.title || '未命名作品'}》`;
  }
  queueSave();
}));

[
  [elements.chapterGoal, 'goal'],
  [elements.chapterOutline, 'outline'],
].forEach(([element, field]) => element.addEventListener('input', event => {
  const chapter = activeChapter();
  chapter[field] = event.target.value;
  touchChapter(chapter);
  if (field === 'outline') elements.outlineGlanceText.textContent = chapter.outline.trim() || '还没有本章提要。先写一句，明确本章的冲突和章末钩子。';
  queueSave();
}));

elements.chapterTarget.addEventListener('change', event => {
  const chapter = activeChapter();
  chapter.target = clampTarget(event.target.value);
  event.target.value = chapter.target;
  touchChapter(chapter);
  updateProgress();
  queueSave();
});

document.addEventListener('keydown', event => {
  if (!(event.ctrlKey || event.metaKey)) return;
  if (event.key.toLowerCase() === 's') {
    event.preventDefault();
    queueSave({immediate: true});
    showToast('当前进度已保存');
  }
  if (event.key === '1') {
    event.preventDefault();
    switchView('write');
  }
  if (event.key === '2') {
    event.preventDefault();
    switchView('outline');
  }
});

window.addEventListener('beforeunload', persistState);
render();
persistState();
