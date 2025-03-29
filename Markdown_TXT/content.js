// 支持的AI网站列表
const AI_SITES = [
    'chatgpt.com',
    'claude.ai',
    'www.coze.com',
    'www.kimi.ai',
    'kimi.moonshot.cn',
    'www.doubao.com',
    'yuanbao.tencent.com',
    'yiyan.baidu.com',
    'tongyi.aliyun.com',
    'xinghuo.xfyun.cn',
    'chat.deepseek.com',
    'www.moonshot.cn',
    'poe.com',
    'chatglm.cn',
    'gemini.google.com',
    'metaso.cn',
    'coze.cn',
    'ibiling.cn',
    'gw.iflydocs.com',
    'x.ai',
    'www.tiangong.cn',
    'xiaoyi.huawei.com',
    'www.aigc.cn',
    'wenku.baidu.com'
  ];
  
  // 检查当前网站是否在支持列表中
  if (AI_SITES.some(site => location.hostname.includes(site))) {
    addButton();
  }
  
  // 添加清除按钮到页面右下角
  function addButton() {
    // 防止重复添加按钮
    if (document.getElementById('md-to-text-btn')) return;
    
    const btn = document.createElement('button');
    btn.id = 'md-to-text-btn';
    btn.textContent = '清除格式';
    btn.addEventListener('click', handleConvertClick);
    document.body.appendChild(btn);
  }
  
  // 处理清除点击事件
  async function handleConvertClick() {
    const btn = document.getElementById('md-to-text-btn');
    if (!btn) return;
    
    btn.disabled = true;
    btn.textContent = '清除中...';
    
    try {
      const text = await navigator.clipboard.readText();
      const result = cleanMarkdown(text);
      await navigator.clipboard.writeText(result);
      showButtonFeedback(btn, '✓ 已清除');
    } catch (error) {
      console.error('清除失败:', error);
      showButtonFeedback(btn, '❌ 失败');
    }
  }
  
  // 显示按钮反馈并自动复位
  function showButtonFeedback(button, text) {
    button.textContent = text;
    setTimeout(() => {
      button.textContent = '清除格式';
      button.disabled = false;
    }, 1500);
  }
  
  // 精确的Markdown清理函数
  function cleanMarkdown(text) {
    return text
      // 移除标题
      .replace(/^#{1,6}\s*/gm, '')
      
      // 移除粗体和斜体，但保留内容
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      
      // 移除链接和图片，但保留描述文字
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      
      // 移除内联代码和代码块，但保留内容
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      
      // 移除删除线
      .replace(/~~(.*?)~~/g, '$1')
      
      // 移除引用标记
      .replace(/^>\s*/gm, '')
      
      // 精确移除分割线（只匹配单独一行的分割线）
      .replace(/^[\s]*[-—*]{3,}[\s]*$/gm, '')
      
      // 移除列表标记（确保不误删正常文本中的短横线）
      .replace(/^[\s]*[-+*]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      
      // 移除表格标记
      .replace(/^\|.+\|$/gm, line => 
        line.replace(/\|/g, ' ').trim()
      )
      
      // 规范化空格（保留换行）
      .replace(/[ \t]+/g, ' ')
      .replace(/^ +/gm, '')
      
      // 保留换行和段落间距
      .replace(/\n{3,}/g, '\n\n');
  }