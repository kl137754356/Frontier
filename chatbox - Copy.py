#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Frontier AI 聊天助手界面 - REPL 流式交互模式
"""

import sys
import os
import subprocess
import threading
from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                               QTextEdit, QTextBrowser, QPushButton, QLabel,
                               QFrame, QFileDialog, QListWidget, QListWidgetItem,
                               QMenu, QScrollArea, QSizePolicy, QMessageBox)
from PySide6.QtCore import Qt, QTimer, Signal, QUrl, QThread
from PySide6.QtGui import (QFont, QColor, QAction, QCursor, QTextCursor,
                           QPainter, QBrush, QPen, QLinearGradient, QImage,
                           QPainterPath, QPixmap, QRegion)
from PySide6.QtMultimedia import QMediaPlayer, QVideoSink, QVideoFrame, QAudioOutput


# --------------------------
# 悬浮球
# --------------------------
class FloatBall(QWidget):
    clicked = Signal()
    right_clicked = Signal(object)
    moved = Signal()

    def __init__(self, video_path="20250928_124212.mp4"):
        super().__init__()
        self.setFixedSize(58, 58)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setCursor(QCursor(Qt.PointingHandCursor))
        self.dragging = False
        self.has_moved = False
        self.move(1000, 600)
        self.current_frame = None
        self.video_path = video_path
        self.player = QMediaPlayer()
        self.video_sink = QVideoSink()
        self.player.setVideoOutput(self.video_sink)
        self.audio_output = QAudioOutput()
        self.audio_output.setVolume(0)
        self.player.setAudioOutput(self.audio_output)
        self.video_sink.videoFrameChanged.connect(self.on_frame_changed)
        self.player.mediaStatusChanged.connect(self.on_media_status_changed)
        abs_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), video_path)
        if os.path.exists(abs_path):
            self.player.setSource(QUrl.fromLocalFile(abs_path))
            self.player.play()

    def on_frame_changed(self, frame: QVideoFrame):
        image = frame.toImage()
        if not image.isNull():
            dpr = self.devicePixelRatio()
            size = int(58 * dpr)
            self.current_frame = image.scaled(size, size, Qt.KeepAspectRatioByExpanding, Qt.SmoothTransformation)
            self.current_frame.setDevicePixelRatio(dpr)
            self.update()

    def on_media_status_changed(self, status):
        if status == QMediaPlayer.MediaStatus.EndOfMedia:
            self.player.setPosition(0)
            self.player.play()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        path = QPainterPath()
        path.addEllipse(0, 0, 58, 58)
        painter.setClipPath(path)
        if self.current_frame and not self.current_frame.isNull():
            dpr = self.devicePixelRatio()
            size = int(58 * dpr)
            img_w = self.current_frame.width()
            img_h = self.current_frame.height()
            x = (img_w - size) // 2
            y = (img_h - size) // 2
            cropped = self.current_frame.copy(max(0, x), max(0, y), size, size)
            cropped.setDevicePixelRatio(dpr)
            painter.drawImage(0, 0, cropped)
        else:
            gradient = QLinearGradient(0, 0, 58, 58)
            gradient.setColorAt(0, QColor("#3aafe0"))
            gradient.setColorAt(1, QColor("#1e9bd7"))
            painter.setBrush(QBrush(gradient))
            painter.setPen(Qt.NoPen)
            painter.drawEllipse(0, 0, 58, 58)
            painter.setPen(QPen(Qt.white, 2))
            painter.setFont(QFont("Arial", 20))
            painter.drawText(self.rect(), Qt.AlignCenter, "\U0001f916")

    def mousePressEvent(self, e):
        if e.button() == Qt.LeftButton:
            self.drag_start = e.globalPosition().toPoint()
            self.window_pos = self.pos()
            self.dragging = True
            self.has_moved = False

    def mouseMoveEvent(self, e):
        if self.dragging:
            delta = e.globalPosition().toPoint() - self.drag_start
            if delta.manhattanLength() > 5:
                self.has_moved = True
            self.move(self.window_pos + delta)
            self.moved.emit()

    def mouseReleaseEvent(self, e):
        if e.button() == Qt.LeftButton:
            self.dragging = False
            if not self.has_moved:
                self.clicked.emit()

    def contextMenuEvent(self, e):
        self.right_clicked.emit(e.globalPos())


# --------------------------
# 聊天窗口
# --------------------------
class ChatWindow(QWidget):
    send_message = Signal(str)
    new_chat = Signal()
    show_history = Signal()
    screenshot_requested = Signal()
    attach_requested = Signal()

    def __init__(self):
        super().__init__()
        self.setFixedSize(420, 680)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setup_ui()

    def setup_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        self.container = QFrame(self)
        self.container.setObjectName("chatContainer")
        self.container.setStyleSheet("QFrame#chatContainer { background: white; border-radius: 18px; }")
        container_layout = QVBoxLayout(self.container)
        container_layout.setContentsMargins(0, 0, 0, 0)
        container_layout.setSpacing(0)
        main_layout.addWidget(self.container)

        # 标题栏
        header = QLabel(" Frontier 助手")
        header.setFixedHeight(52)
        header.setStyleSheet("""
            background-color: #1e9bd7; color: white; font-size: 16px;
            font-weight: 500; padding-left: 16px;
            border-top-left-radius: 18px; border-top-right-radius: 18px;
        """)
        container_layout.addWidget(header)

        # 消息区域
        self.chat_area = QWidget()
        self.chat_area.setStyleSheet("background: #f9fafb;")
        self.chat_layout = QVBoxLayout(self.chat_area)
        self.chat_layout.setContentsMargins(16, 16, 16, 16)
        self.chat_layout.setSpacing(12)
        self.chat_layout.addStretch()

        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setWidget(self.chat_area)
        self.scroll_area.setStyleSheet("""
            QScrollArea { background: #f9fafb; border: none; }
            QScrollBar:vertical { width: 6px; }
            QScrollBar::handle:vertical { background: #ddd; border-radius: 3px; }
        """)
        container_layout.addWidget(self.scroll_area, 1)

        # 底部输入区域
        footer = QWidget()
        footer.setStyleSheet("background: white; border-top: 1px solid #eee; border-bottom-left-radius: 18px; border-bottom-right-radius: 18px;")
        footer_layout = QVBoxLayout(footer)
        footer_layout.setContentsMargins(12, 12, 12, 12)
        footer_layout.setSpacing(0)

        input_box = QFrame(footer)
        input_box.setStyleSheet("QFrame { border: 1px solid #e5e7eb; border-radius: 16px; background: white; }")
        input_box_layout = QVBoxLayout(input_box)
        input_box_layout.setContentsMargins(0, 0, 0, 0)
        input_box_layout.setSpacing(0)

        self.text_input = QTextEdit(input_box)
        self.text_input.setPlaceholderText("请输入问题...")
        self.text_input.setStyleSheet("QTextEdit { border: none; padding: 12px 14px; font-size: 14px; background: transparent; }")
        self.text_input.setFixedHeight(50)
        self.text_input.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.text_input.installEventFilter(self)
        input_box_layout.addWidget(self.text_input)

        # 操作栏
        actions_bar = QWidget(input_box)
        actions_bar.setStyleSheet("border-top: 1px solid #f3f4f6;")
        actions_layout = QHBoxLayout(actions_bar)
        actions_layout.setContentsMargins(10, 6, 10, 6)
        actions_layout.setSpacing(4)

        btn_style = "QPushButton { border: none; background: transparent; font-size: 16px; border-radius: 8px; width: 32px; height: 32px; } QPushButton:hover { background: #f3f4f6; }"

        self.btn_screenshot = QPushButton("\U0001f4f7")
        self.btn_screenshot.setFixedSize(32, 32)
        self.btn_screenshot.setStyleSheet(btn_style)
        self.btn_screenshot.clicked.connect(self.screenshot_requested.emit)
        actions_layout.addWidget(self.btn_screenshot)

        self.btn_attach = QPushButton("\U0001f4ce")
        self.btn_attach.setFixedSize(32, 32)
        self.btn_attach.setStyleSheet(btn_style)
        self.btn_attach.clicked.connect(self.attach_requested.emit)
        actions_layout.addWidget(self.btn_attach)

        actions_layout.addStretch()

        self.btn_new_chat = QPushButton("\u2795")
        self.btn_new_chat.setFixedSize(32, 32)
        self.btn_new_chat.setStyleSheet(btn_style)
        self.btn_new_chat.clicked.connect(self.new_chat.emit)
        actions_layout.addWidget(self.btn_new_chat)

        self.btn_history = QPushButton("\U0001f558")
        self.btn_history.setFixedSize(32, 32)
        self.btn_history.setStyleSheet(btn_style)
        self.btn_history.clicked.connect(self.show_history.emit)
        actions_layout.addWidget(self.btn_history)

        self.btn_send = QPushButton("发送")
        self.btn_send.setStyleSheet("QPushButton { padding: 6px 16px; background-color: #1e9bd7; color: white; border: none; border-radius: 14px; font-size: 14px; } QPushButton:hover { background-color: #178ab8; }")
        self.btn_send.clicked.connect(self.on_send)
        actions_layout.addWidget(self.btn_send)

        input_box_layout.addWidget(actions_bar)
        footer_layout.addWidget(input_box)
        container_layout.addWidget(footer)

    def eventFilter(self, obj, event):
        if obj == self.text_input and event.type() == event.Type.KeyPress:
            if event.key() == Qt.Key_Return and not (event.modifiers() & Qt.ShiftModifier):
                self.on_send()
                return True
        return super().eventFilter(obj, event)

    def on_send(self):
        text = self.text_input.toPlainText().strip()
        if text:
            self.send_message.emit(text)
            self.text_input.clear()

    def add_message(self, text, is_user=False):
        bubble = QLabel(text)
        bubble.setWordWrap(True)
        bubble.setTextFormat(Qt.RichText)
        bubble.setTextInteractionFlags(Qt.TextSelectableByMouse | Qt.TextBrowserInteraction)
        bubble.setCursor(QCursor(Qt.IBeamCursor))
        bubble.setContextMenuPolicy(Qt.CustomContextMenu)
        bubble.customContextMenuRequested.connect(lambda pos, b=bubble: self._show_copy_menu(b, pos))
        bubble.setSizePolicy(QSizePolicy.Preferred, QSizePolicy.Minimum)
        bubble.setMaximumWidth(300)

        if is_user:
            bubble.setStyleSheet("QLabel { background-color: #1e9bd7; color: white; padding: 10px 14px; border-radius: 14px; border-top-right-radius: 4px; font-size: 14px; }")
            container = QWidget()
            layout = QHBoxLayout(container)
            layout.setContentsMargins(0, 0, 0, 0)
            layout.addStretch()
            layout.addWidget(bubble)
        else:
            bubble.setStyleSheet("QLabel { background-color: white; color: #111827; border: 1px solid #e5e7eb; padding: 10px 14px; border-radius: 14px; border-top-left-radius: 4px; font-size: 14px; }")
            container = QWidget()
            layout = QHBoxLayout(container)
            layout.setContentsMargins(0, 0, 0, 0)
            layout.addWidget(bubble)
            layout.addStretch()

        self.chat_layout.insertWidget(self.chat_layout.count() - 1, container)
        QTimer.singleShot(10, self.scroll_to_bottom)
        return bubble

    def scroll_to_bottom(self):
        self.scroll_area.verticalScrollBar().setValue(self.scroll_area.verticalScrollBar().maximum())

    def _show_copy_menu(self, bubble, pos):
        """右键复制菜单"""
        menu = QMenu(self)
        copy_action = menu.addAction("复制")
        action = menu.exec(bubble.mapToGlobal(pos))
        if action == copy_action:
            # 获取纯文本（去除 HTML 标签）
            import re
            html_text = bubble.text()
            plain = re.sub(r'<br\s*/?>', '\n', html_text)
            plain = re.sub(r'<[^>]+>', '', plain)
            QApplication.clipboard().setText(plain)

    def clear_messages(self):
        while self.chat_layout.count() > 1:
            item = self.chat_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()


# --------------------------
# REPL 工作线程
# --------------------------
class ClawReplWorker(QThread):
    """单次 prompt 模式，流式逐行读取输出"""
    chunk_received = Signal(str)
    reply_finished = Signal()
    error_occurred = Signal(str)

    def __init__(self, env, cwd, prompt_text):
        super().__init__()
        self.env = env
        self.cwd = cwd
        self.prompt_text = prompt_text
        self._stop_flag = False

    def run(self):
        claw_path = os.path.join(self.cwd, "rust", "target", "debug", "claw.exe")
        cmd = [claw_path, "--output-format", "text", "--compact",
               "--dangerously-skip-permissions",
               "--allowedTools", "PowerShell,bash,read_file,grep_search,Skill",
               "prompt", self.prompt_text]

        try:
            process = subprocess.Popen(
                cmd,
                stdin=subprocess.DEVNULL,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=self.env,
                cwd=self.cwd,
                creationflags=subprocess.CREATE_NO_WINDOW,
            )
        except Exception as e:
            self.error_occurred.emit(f"启动 claw 失败: {e}")
            return

        # 后台读 stderr
        def drain_stderr():
            try:
                for _ in iter(process.stderr.readline, b''):
                    if self._stop_flag:
                        break
            except Exception:
                pass

        threading.Thread(target=drain_stderr, daemon=True).start()

        # 逐行流式读取 stdout
        try:
            for raw_line in iter(process.stdout.readline, b''):
                if self._stop_flag:
                    break
                line = raw_line.decode("utf-8", errors="replace").rstrip("\r\n")
                if line:
                    self.chunk_received.emit(line + "\n")
        except Exception:
            pass

        process.wait()
        self.reply_finished.emit()

    def stop(self):
        self._stop_flag = True

    def stop(self):
        self._stop_flag = True


# --------------------------
# 右键菜单
# --------------------------
class BallContextMenu(QMenu):
    login_requested = Signal()
    settings_requested = Signal()
    about_requested = Signal()

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setStyleSheet("QMenu { background: white; border-radius: 10px; padding: 6px 0; min-width: 140px; border: 1px solid #e5e7eb; } QMenu::item { padding: 10px 18px; font-size: 14px; color: #333; } QMenu::item:selected { background: #f3f4f6; }")
        a1 = QAction("\U0001f511 登入", self)
        a1.triggered.connect(self.login_requested.emit)
        self.addAction(a1)
        self.addSeparator()
        a2 = QAction("\u2699\ufe0f 设置", self)
        a2.triggered.connect(self.settings_requested.emit)
        self.addAction(a2)
        self.addSeparator()
        a3 = QAction("\u2139\ufe0f 关于", self)
        a3.triggered.connect(self.about_requested.emit)
        self.addAction(a3)


# --------------------------
# 主程序
# --------------------------
class FrontierApp:
    def __init__(self):
        self.conversations = []
        self.current_conv_id = None
        self.repl_worker = None
        self.streaming_bubble = None
        self.current_reply = ""

        self.project_dir = os.path.dirname(os.path.abspath(__file__))
        self.env = self.load_env()

        self.float_ball = FloatBall()
        self.chat_window = ChatWindow()
        self.context_menu = BallContextMenu()

        # 连接信号
        self.float_ball.clicked.connect(self.toggle_chat)
        self.float_ball.right_clicked.connect(self.show_context_menu)
        self.float_ball.moved.connect(self.on_ball_moved)
        self.chat_window.send_message.connect(self.on_send)
        self.chat_window.new_chat.connect(self.on_new_chat)
        self.chat_window.attach_requested.connect(self.on_attach)
        self.context_menu.about_requested.connect(
            lambda: QMessageBox.about(self.chat_window, "关于", "Frontier 助手 v1.0"))

        self.init_first_conversation()
        self.float_ball.show()

    def load_env(self):
        env = os.environ.copy()
        ps_script = os.path.join(self.project_dir, "set-anthropic-env.ps1")
        if os.path.exists(ps_script):
            try:
                cmd = f'powershell -NoProfile -ExecutionPolicy Bypass -Command ". \'{ps_script}\'; Get-ChildItem Env:ANTHROPIC_* | ForEach-Object {{ \\"$($_.Name)=$($_.Value)\\" }}"'
                result = subprocess.run(cmd, capture_output=True, text=True, shell=True,
                                        encoding="utf-8", cwd=self.project_dir)
                if result.returncode == 0:
                    for line in result.stdout.splitlines():
                        line = line.strip()
                        if line and '=' in line:
                            key, _, value = line.partition('=')
                            env[key] = value
                    print("[OK] 环境变量已加载")
            except Exception as e:
                print(f"[WARN] 加载环境变量失败: {e}")
        return env

    def init_first_conversation(self):
        conv = {'id': 1, 'title': '新对话', 'time': '刚刚', 'messages': []}
        self.conversations.append(conv)
        self.current_conv_id = conv['id']
        self.chat_window.add_message("你好！我是Hexagon助手，你可以问我各种问题～", is_user=False)

    def start_repl(self):
        pass  # 不再需要预启动

    def toggle_chat(self):
        if self.chat_window.isVisible():
            self.chat_window.hide()
        else:
            self.position_chat_window()
            self.chat_window.show()

    def position_chat_window(self):
        ball_pos = self.float_ball.pos()
        x = ball_pos.x() - 420 - 12
        y = ball_pos.y() + 58 - 680
        if x < 0:
            x = ball_pos.x() + 58 + 12
        if y < 0:
            y = 0
        self.chat_window.move(x, y)

    def on_ball_moved(self):
        if self.chat_window.isVisible():
            self.position_chat_window()

    def show_context_menu(self, pos):
        self.context_menu.exec(pos)

    def on_send(self, text):
        self.chat_window.add_message(text, is_user=True)

        # 创建流式气泡
        self.streaming_bubble = self.chat_window.add_message(
            '<span style="color:#9ca3af;">Thinking...</span>', is_user=False)
        self.current_reply = ""

        self.chat_window.btn_send.setEnabled(False)
        self.chat_window.btn_send.setText("等待中")

        # 每次发送启动一个新的 prompt 进程（流式读取）
        self.repl_worker = ClawReplWorker(self.env, self.project_dir, text)
        self.repl_worker.chunk_received.connect(self.on_chunk_received)
        self.repl_worker.reply_finished.connect(self.on_reply_finished)
        self.repl_worker.error_occurred.connect(self.on_repl_error)
        self.repl_worker.start()

    def on_chunk_received(self, chunk):
        if self.streaming_bubble:
            self.current_reply += chunk
            # 逐字打字机效果：将新内容加入队列
            if not hasattr(self, '_typewriter_timer') or self._typewriter_timer is None:
                self._display_pos = 0
                self._typewriter_timer = QTimer()
                self._typewriter_timer.timeout.connect(self._typewriter_tick)
                self._typewriter_timer.start(15)

    def _typewriter_tick(self):
        """逐字显示"""
        if not self.streaming_bubble:
            if self._typewriter_timer:
                self._typewriter_timer.stop()
                self._typewriter_timer = None
            return

        # 每次显示多几个字符（加快速度）
        step = 3
        target = min(self._display_pos + step, len(self.current_reply))
        if self._display_pos < target:
            self._display_pos = target
            partial = self.current_reply[:self._display_pos]
            display = self.format_markdown(partial)
            self.streaming_bubble.setText(display)
            self.streaming_bubble.adjustSize()
            self.chat_window.scroll_to_bottom()
        elif self._display_pos >= len(self.current_reply):
            # 已追上，暂停等待新内容
            pass

    def on_reply_finished(self):
        # 确保显示完整内容
        if self._typewriter_timer:
            self._typewriter_timer.stop()
            self._typewriter_timer = None
        if self.streaming_bubble and self.current_reply:
            display = self.format_markdown(self.current_reply)
            self.streaming_bubble.setText(display)
            self.streaming_bubble.adjustSize()
            self.chat_window.scroll_to_bottom()
        self.chat_window.btn_send.setEnabled(True)
        self.chat_window.btn_send.setText("发送")
        self.streaming_bubble = None

    def format_markdown(self, text):
        """将 AI 返回的 Markdown 文本格式化为 HTML"""
        import re

        # 处理代码块 ```lang ... ```
        def replace_code_block(match):
            code = match.group(2).strip()
            code = code.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            return (f'<div style="background:#f1f5f9; padding:8px 10px; border-radius:6px; '
                    f'margin:4px 0; font-family:Consolas,monospace; font-size:12px; '
                    f'white-space:pre-wrap;">{code}</div>')

        text = re.sub(r'```(\w*)\n?(.*?)```', replace_code_block, text, flags=re.DOTALL)

        # 行内代码
        text = re.sub(r'`([^`]+)`',
                      r'<code style="background:#f1f5f9; padding:1px 4px; border-radius:3px; font-family:Consolas,monospace; font-size:12px;">\1</code>',
                      text)

        # 加粗
        text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)

        # 标题
        text = re.sub(r'^### (.+)$', r'<b>\1</b>', text, flags=re.MULTILINE)
        text = re.sub(r'^## (.+)$', r'<b style="font-size:14px;">\1</b>', text, flags=re.MULTILINE)
        text = re.sub(r'^# (.+)$', r'<b style="font-size:15px;">\1</b>', text, flags=re.MULTILINE)

        # 列表项
        text = re.sub(r'^- (.+)$', '\u2022 \\1', text, flags=re.MULTILINE)
        text = re.sub(r'^\* (.+)$', '\u2022 \\1', text, flags=re.MULTILINE)
        text = re.sub(r'^\d+\. (.+)$', '\u2022 \\1', text, flags=re.MULTILINE)

        # 换行
        text = text.replace("\n", "<br>")

        return text

    def on_repl_error(self, err):
        if self.streaming_bubble:
            self.streaming_bubble.setText(f"\u26a0\ufe0f {err}")
        else:
            self.chat_window.add_message(f"\u26a0\ufe0f {err}", is_user=False)
        self.chat_window.btn_send.setEnabled(True)
        self.chat_window.btn_send.setText("发送")
        self.streaming_bubble = None

    def on_new_chat(self):
        if self.repl_worker and self.repl_worker.isRunning():
            self.repl_worker.stop()
            self.repl_worker.wait(3000)
            self.repl_worker = None
        conv = {'id': len(self.conversations) + 1, 'title': '新对话', 'time': '刚刚', 'messages': []}
        self.conversations.append(conv)
        self.current_conv_id = conv['id']
        self.chat_window.clear_messages()
        self.chat_window.add_message("你好！我是Hexagon助手，你可以问我各种问题～", is_user=False)

    def on_attach(self):
        files, _ = QFileDialog.getOpenFileNames(self.chat_window, "选择文件", "", "All Files (*)")
        for f in files:
            if f:
                name = f.replace("\\", "/").split("/")[-1]
                self.chat_window.add_message(f"\U0001f4ce {name}", is_user=True)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    font = QFont("Segoe UI", 10)
    font.setStyleStrategy(QFont.PreferAntialias)
    app.setFont(font)
    frontier = FrontierApp()
    sys.exit(app.exec())
