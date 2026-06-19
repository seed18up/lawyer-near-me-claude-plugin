  <script>
  (function () {
    'use strict';

    /* ─────────────────────────────────────────
       CONSTANTS
    ───────────────────────────────────────── */
    const CHAT_API_URL = 'https://legal-chat.seed18up-net.workers.dev';

    const MAX_HISTORY = 10; // messages to send as context

    const AGENTS = {
      'legal-advisor': {
        id:     'legal-advisor',
        name:   'ดร.วรรณา สิทธิชัย',
        avatar: '👩‍⚖️',
        title:  'ที่ปรึกษากฎหมายหลัก',
      },
      'compliance': {
        id:     'compliance',
        name:   'คุณสิทธิศักดิ์ พงษ์ไพบูลย์',
        avatar: '🛡️',
        title:  'Compliance Officer',
      },
      'contract': {
        id:     'contract',
        name:   'คุณภัทรพงษ์ อารีย์วงศ์',
        avatar: '📋',
        title:  'Contract Specialist',
      },
    };

    /* ─────────────────────────────────────────
       STATE
    ───────────────────────────────────────── */
    let activeAgent    = AGENTS['legal-advisor'];
    let messageHistory = [];   // {role, content}[]
    let isPanelOpen    = false;
    let isStreaming    = false;
    let welcomeShown   = {}; // agentId → bool
    let userMessageCount = 0;
    let ctaShown         = false;

    /* ─────────────────────────────────────────
       DOM REFS
    ───────────────────────────────────────── */
    const toggle       = document.getElementById('cw-toggle');
    const toggleIcon   = document.getElementById('cw-toggle-icon');
    const badge        = document.getElementById('cw-badge');
    const panel        = document.getElementById('cw-panel');
    const messagesEl   = document.getElementById('cw-messages');
    const typingEl     = document.getElementById('cw-typing');
    const typingAvatar = document.getElementById('cw-typing-avatar');
    const textarea     = document.getElementById('cw-textarea');
    const sendBtn      = document.getElementById('cw-send-btn');
    const tabs         = document.querySelectorAll('.cw-tab');
    const chips        = document.querySelectorAll('.cw-chip');
    const agentAvatar  = document.getElementById('cw-agent-avatar');
    const agentName    = document.getElementById('cw-agent-name');
    const agentTitle   = document.getElementById('cw-agent-title');
    const closeBtn     = document.getElementById('cw-close-btn');

    /* ─────────────────────────────────────────
       HELPERS
    ───────────────────────────────────────── */
    function scrollBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      typingAvatar.textContent = activeAgent.avatar;
      typingEl.classList.add('cw-visible');
      typingEl.setAttribute('aria-hidden', 'false');
      // Move typing indicator to end of messages list
      messagesEl.appendChild(typingEl);
      scrollBottom();
    }

    function hideTyping() {
      typingEl.classList.remove('cw-visible');
      typingEl.setAttribute('aria-hidden', 'true');
    }

    function setInputDisabled(disabled) {
      textarea.disabled = disabled;
      sendBtn.disabled  = disabled;
      isStreaming       = disabled;
    }

    /* ─────────────────────────────────────────
       RENDER MESSAGES
    ───────────────────────────────────────── */
    function appendUserBubble(text) {
      const row = document.createElement('div');
      row.className = 'cw-msg-user';
      const bubble = document.createElement('div');
      bubble.className = 'cw-bubble';
      bubble.textContent = text;
      row.appendChild(bubble);
      messagesEl.appendChild(row);
      scrollBottom();
      return bubble;
    }

    function appendAgentBubble(agentObj) {
      const row  = document.createElement('div');
      row.className = 'cw-msg-agent';

      const ava  = document.createElement('div');
      ava.className = 'cw-msg-agent-avatar';
      ava.textContent = agentObj.avatar;

      const wrap = document.createElement('div');
      wrap.className = 'cw-msg-agent-wrap';

      const nameEl = document.createElement('div');
      nameEl.className = 'cw-msg-agent-name';
      nameEl.textContent = agentObj.name;

      const bubble = document.createElement('div');
      bubble.className = 'cw-bubble';

      wrap.appendChild(nameEl);
      wrap.appendChild(bubble);
      row.appendChild(ava);
      row.appendChild(wrap);
      messagesEl.appendChild(row);
      scrollBottom();
      return bubble;
    }

    function appendErrorBubble() {
      const bubble = appendAgentBubble(activeAgent);
      bubble.textContent = 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      bubble.style.color = 'var(--red)';
    }

    function showCallbackCTA() {
      if (ctaShown) return;
      ctaShown = true;
      const row = document.createElement('div');
      row.className = 'cw-msg-agent';
      row.innerHTML =
        '<div class="cw-msg-agent-avatar">' + activeAgent.avatar + '</div>' +
        '<div class="cw-msg-agent-wrap">' +
          '<div class="cw-msg-agent-name">' + activeAgent.name + '</div>' +
          '<div style="background:#f0f4ff;border:1.5px solid #c7d3f5;border-radius:12px;padding:14px 16px;margin-top:4px;">' +
            '<div style="font-size:14px;font-weight:700;color:#1B3A8B;margin-bottom:6px;">📞 ต้องการให้ทนายโทรกลับไหม?</div>' +
            '<div style="font-size:13px;color:#555;margin-bottom:12px;line-height:1.5;">ฟรี ไม่มีค่าใช้จ่าย · ทนายความโทรกลับภายใน 24 ชั่วโมง</div>' +
            '<a href="consult.html" style="display:block;text-align:center;background:#1B3A8B;color:#fff;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;">จองนัดโทรกลับ →</a>' +
          '</div>' +
        '</div>';
      messagesEl.appendChild(row);
      scrollBottom();
    }

    /* ─────────────────────────────────────────
       WELCOME MESSAGE
    ───────────────────────────────────────── */
    function showWelcome(agent) {
      if (welcomeShown[agent.id]) return;
      welcomeShown[agent.id] = true;

      const suffix = agent.id === 'compliance' ? 'ครับ' : 'ค่ะ';
      const pronoun = agent.id === 'compliance' ? 'ผม' : 'ดิฉัน';
      const text = `สวัสดี${suffix} ${pronoun} ${agent.name} ยินดีให้คำปรึกษาเบื้องต้นด้านกฎหมาย มีเรื่องอะไรให้ช่วยไหม${suffix}?`;

      const bubble = appendAgentBubble(agent);
      bubble.textContent = text;
      scrollBottom();
    }

    /* ─────────────────────────────────────────
       TOGGLE PANEL
    ───────────────────────────────────────── */
    function openPanel() {
      isPanelOpen = true;
      panel.classList.add('cw-visible');
      panel.setAttribute('aria-hidden', 'false');
      toggle.classList.add('cw-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggleIcon.textContent = '✕';
      badge.style.display = 'none';
      textarea.focus();
      showWelcome(activeAgent);
    }
    window.cwOpenPanel = openPanel;
    window.cwOpenWithTopic = function(label) {
      openPanel();
      setTimeout(function() {
        sendMessage('สอบถามเรื่อง' + label + ' ช่วยแนะนำสิทธิ์และขั้นตอนทางกฎหมายด้วยครับ');
      }, 350);
    };

    function closePanel() {
      isPanelOpen = false;
      panel.classList.remove('cw-visible');
      panel.setAttribute('aria-hidden', 'true');
      toggle.classList.remove('cw-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggleIcon.textContent = '⚖️';
    }

    toggle.addEventListener('click', function () {
      if (isPanelOpen) { closePanel(); } else { openPanel(); }
    });

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closePanel();
    });

    /* ─────────────────────────────────────────
       AGENT SELECTOR TABS
    ───────────────────────────────────────── */
    function switchAgent(agentId) {
      activeAgent = AGENTS[agentId] || AGENTS['legal-advisor'];
      // Update header
      agentAvatar.textContent = activeAgent.avatar;
      agentName.textContent   = activeAgent.name;
      agentTitle.textContent  = activeAgent.title;
      typingAvatar.textContent = activeAgent.avatar;
      // Reset history when switching agent
      messageHistory = [];
      userMessageCount = 0;
      ctaShown = false;
      // Clear messages
      const rows = messagesEl.querySelectorAll('.cw-msg-user, .cw-msg-agent:not(#cw-typing)');
      rows.forEach(function (r) { r.remove(); });
      // Show welcome for new agent
      showWelcome(activeAgent);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('cw-tab-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('cw-tab-active');
        tab.setAttribute('aria-selected', 'true');
        switchAgent(tab.dataset.agent);
      });
    });

    /* ─────────────────────────────────────────
       QUICK TOPIC CHIPS
    ───────────────────────────────────────── */
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const topic = chip.dataset.topic;
        sendMessage(topic);
      });
    });

    /* ─────────────────────────────────────────
       AUTO-RESIZE TEXTAREA
    ───────────────────────────────────────── */
    textarea.addEventListener('input', function () {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 90) + 'px';
    });

    /* ─────────────────────────────────────────
       SEND ON ENTER (not Shift+Enter)
    ───────────────────────────────────────── */
    textarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!isStreaming) sendMessage();
      }
    });

    sendBtn.addEventListener('click', function () {
      if (!isStreaming) sendMessage();
    });

    /* ─────────────────────────────────────────
       SEND MESSAGE + STREAMING
    ───────────────────────────────────────── */
    function sendMessage(overrideText) {
      const text = (overrideText !== undefined ? overrideText : textarea.value).trim();
      if (!text) return;

      // Clear input
      if (overrideText === undefined) {
        textarea.value = '';
        textarea.style.height = 'auto';
      }

      // Add user bubble
      appendUserBubble(text);
      userMessageCount++;

      // Update history
      messageHistory.push({ role: 'user', content: text });
      if (messageHistory.length > MAX_HISTORY) {
        messageHistory = messageHistory.slice(-MAX_HISTORY);
      }

      setInputDisabled(true);
      showTyping();

      // Prepare agent bubble for streaming (created after typing hides)
      let agentBubble = null;
      let accumulated = '';

      fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messageHistory.slice(),
          agent:    activeAgent.id,
        }),
      })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (t) { throw new Error(t || res.status); });
        }

        hideTyping();
        agentBubble = appendAgentBubble(activeAgent);

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let   buffer  = '';

        function pump() {
          return reader.read().then(function (result) {
            if (result.done) {
              // Stream complete — store assistant turn in history
              if (accumulated) {
                messageHistory.push({ role: 'assistant', content: accumulated });
                if (messageHistory.length > MAX_HISTORY) {
                  messageHistory = messageHistory.slice(-MAX_HISTORY);
                }
              }
              setInputDisabled(false);
              textarea.focus();
              scrollBottom();
              if (userMessageCount >= 2 && !ctaShown) {
                setTimeout(showCallbackCTA, 800);
              }
              return;
            }

            buffer += decoder.decode(result.value, { stream: true });

            // Process SSE lines
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep incomplete line

            lines.forEach(function (line) {
              if (!line.startsWith('data: ')) return;
              const data = line.slice(6).trim();
              if (data === '[DONE]') return;

              let parsed;
              try { parsed = JSON.parse(data); } catch (e) { return; }

              // Anthropic SSE: content_block_delta with delta.text
              if (
                parsed.type === 'content_block_delta' &&
                parsed.delta &&
                parsed.delta.type === 'text_delta' &&
                typeof parsed.delta.text === 'string'
              ) {
                accumulated += parsed.delta.text;
                agentBubble.textContent = accumulated;
                scrollBottom();
              }
            });

            return pump();
          });
        }

        return pump();
      })
      .catch(function (err) {
        console.error('[ChatWidget] error:', err);
        hideTyping();
        appendErrorBubble();
        setInputDisabled(false);
        textarea.focus();
        scrollBottom();
      });
    }

  })();
  </script>
