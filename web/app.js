const toast = document.querySelector('#toast');
let toastTimer;

const replies = {
  续写第二章: '已选择 1：接下来续写《轮回失格》第二章，按 2000-2500 字推进。',
  拆分本卷章节: '已选择：第一卷按每章 2000-2500 字拆分，单章目标 2200 字。',
  更换设定: '已选择 2：告诉我想改哪一项，比如主角名、书名、副本或规则。',
  查看七号教学楼30章大纲: '已选择 3：将展开《七号教学楼》30章大纲。',
  评估章节质量: '已选择 4：将从开篇钩子、悬念、节奏、爽点和恐怖感检查。',
  生成第二章正文: '下一步建议：直接生成第二章正文，目标 2200 字，结尾保留强悬念。',
  补全第一卷大纲: '下一步建议：先补齐七号教学楼 30 章大纲，再逐章写正文。',
  设计苏晚晴人物弧: '下一步建议：确定苏晚晴的秘密、误导点和成为同伴的代价。',
  建立章节质检表: '下一步建议：每章发布前检查开篇钩子、信息差、反转和追读点。',
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('[data-command]').forEach(button => {
  button.addEventListener('click', () => showToast(replies[button.dataset.command] || '已选择该命令'));
});

document.addEventListener('keydown', event => {
  const hotkeys = ['续写第二章', '更换设定', '查看七号教学楼30章大纲', '评估章节质量'];
  if (['1', '2', '3', '4'].includes(event.key)) {
    showToast(replies[hotkeys[Number(event.key) - 1]]);
  }
});
