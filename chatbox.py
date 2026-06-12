#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Frontier AI 聊天助手界面 - REPL 流式交互模式
"""

import sys
import os
import subprocess
import threading
import logging

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format='[%(asctime)s] [chatbox] %(levelname)s: %(message)s',
    datefmt='%H:%M:%S'
)
log = logging.getLogger("chatbox")
from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                               QTextEdit, QTextBrowser, QPushButton, QLabel,
                               QFrame, QFileDialog, QListWidget, QListWidgetItem,
                               QMenu, QScrollArea, QSizePolicy, QMessageBox,
                               QComboBox)
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
        self.setMinimumSize(320, 480)
        self.resize(420, 680)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setAttribute(Qt.WA_Hover, True)
        self._resize_edge = None
        self._resize_start_pos = None
        self._resize_start_geo = None
        self.setMouseTracking(True)
        self.setup_ui()
        # 给所有子控件启用 mouse tracking 并安装事件过滤器
        self._enable_tracking_recursive(self)

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
        header = QWidget()
        header.setFixedHeight(52)
        header.setStyleSheet("background-color: #1e9bd7; border-top-left-radius: 18px; border-top-right-radius: 18px;")
        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(16, 0, 8, 0)
        header_layout.setSpacing(0)

        title_label = QLabel("Frontier 助手")
        title_label.setStyleSheet("color: white; font-size: 16px; font-weight: 500; background: transparent;")
        header_layout.addWidget(title_label)
        header_layout.addStretch()

        # 最大化/还原按钮
        self.btn_maximize = QPushButton("🗖")
        self.btn_maximize.setFixedSize(32, 32)
        self.btn_maximize.setToolTip("最大化/还原")
        self.btn_maximize.setStyleSheet("QPushButton { border: none; background: transparent; color: white; font-size: 16px; border-radius: 6px; } QPushButton:hover { background: rgba(255,255,255,0.2); }")
        self.btn_maximize.clicked.connect(self._toggle_maximize)
        header_layout.addWidget(self.btn_maximize)

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
        self.text_input.setStyleSheet("QTextEdit { border: none; padding: 12px 14px; font-size: 14px; font-family: Arial, 'Microsoft YaHei'; background: transparent; }")
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
        self.btn_screenshot.setToolTip("截图")
        self.btn_screenshot.setStyleSheet(btn_style)
        self.btn_screenshot.clicked.connect(self.screenshot_requested.emit)
        actions_layout.addWidget(self.btn_screenshot)

        self.btn_attach = QPushButton("\U0001f4ce")
        self.btn_attach.setFixedSize(32, 32)
        self.btn_attach.setToolTip("附件")
        self.btn_attach.setStyleSheet(btn_style)
        self.btn_attach.clicked.connect(self.attach_requested.emit)
        actions_layout.addWidget(self.btn_attach)

        actions_layout.addStretch()

        self.btn_new_chat = QPushButton("\u2795")
        self.btn_new_chat.setFixedSize(32, 32)
        self.btn_new_chat.setToolTip("新对话")
        self.btn_new_chat.setStyleSheet(btn_style)
        self.btn_new_chat.clicked.connect(self.new_chat.emit)
        actions_layout.addWidget(self.btn_new_chat)

        self.btn_history = QPushButton("\U0001f558")
        self.btn_history.setFixedSize(32, 32)
        self.btn_history.setToolTip("历史记录")
        self.btn_history.setStyleSheet(btn_style)
        self.btn_history.clicked.connect(self.show_history.emit)
        actions_layout.addWidget(self.btn_history)

        self.btn_send = QPushButton("发送")
        self.btn_send.setToolTip("发送消息 (Enter)")
        self.btn_send.setStyleSheet("QPushButton { padding: 6px 16px; background-color: #1e9bd7; color: white; border: none; border-radius: 14px; font-size: 14px; font-family: Arial, 'Microsoft YaHei'; } QPushButton:hover { background-color: #178ab8; }")
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
        bubble = QTextBrowser()
        bubble.setOpenExternalLinks(True)
        bubble.setReadOnly(True)
        bubble.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        bubble.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        bubble.setContextMenuPolicy(Qt.CustomContextMenu)
        bubble.customContextMenuRequested.connect(lambda pos, b=bubble: self._show_copy_menu(b, pos))
        bubble.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Minimum)
        bubble.setMaximumWidth(int(self.width() * 0.82))
        bubble.setHtml(text)

        # 自动调整高度
        def adjust_height():
            doc = bubble.document()
            doc.setTextWidth(bubble.viewport().width())
            h = int(doc.size().height()) + 16
            bubble.setFixedHeight(max(h, 36))
        bubble.textChanged = adjust_height

        if is_user:
            bubble.setStyleSheet("""
                QTextBrowser {
                    background-color: #1e9bd7; color: white;
                    padding: 10px 14px; border-radius: 14px; border-top-right-radius: 4px;
                    font-size: 14px; font-family: Arial, 'Microsoft YaHei';
                    border: none;
                }
            """)
            container = QWidget()
            layout = QHBoxLayout(container)
            layout.setContentsMargins(0, 0, 0, 0)
            layout.addStretch()
            layout.addWidget(bubble)
        else:
            bubble.setStyleSheet("""
                QTextBrowser {
                    background-color: white; color: #111827;
                    border: 1px solid #e5e7eb;
                    padding: 10px 14px; border-radius: 14px; border-top-left-radius: 4px;
                    font-size: 14px; font-family: Arial, 'Microsoft YaHei';
                }
            """)
            container = QWidget()
            layout = QHBoxLayout(container)
            layout.setContentsMargins(0, 0, 0, 0)
            layout.addWidget(bubble)
            layout.addStretch()

        self.chat_layout.insertWidget(self.chat_layout.count() - 1, container)
        QTimer.singleShot(10, self.scroll_to_bottom)
        QTimer.singleShot(50, adjust_height)
        return bubble

    def scroll_to_bottom(self):
        self.scroll_area.verticalScrollBar().setValue(self.scroll_area.verticalScrollBar().maximum())

    def _toggle_maximize(self):
        """最大化/还原窗口"""
        if self.isMaximized():
            self.showNormal()
            self.btn_maximize.setText("🗖")
            # 恢复圆角
            self.container.setStyleSheet("QFrame#chatContainer { background: white; border-radius: 18px; }")
        else:
            self._normal_geo = self.geometry()
            self.showMaximized()
            self.btn_maximize.setText("🗗")
            # 最大化时去掉圆角
            self.container.setStyleSheet("QFrame#chatContainer { background: white; border-radius: 0px; }")

    def resizeEvent(self, event):
        """窗口大小变化时，调整所有气泡宽度"""
        super().resizeEvent(event)
        max_w = int(self.width() * 0.82)
        for i in range(self.chat_layout.count()):
            item = self.chat_layout.itemAt(i)
            if item and item.widget():
                container = item.widget()
                for child in container.findChildren(QTextBrowser):
                    child.setMaximumWidth(max_w)
                    doc = child.document()
                    doc.setTextWidth(child.viewport().width())
                    h = int(doc.size().height()) + 16
                    child.setFixedHeight(max(h, 36))

    # --- 边缘拖拽调整大小 ---
    _EDGE_SIZE = 12

    def _enable_tracking_recursive(self, widget):
        """递归启用 mouse tracking 和 tooltip"""
        widget.setMouseTracking(True)
        widget.setAttribute(Qt.WA_AlwaysShowToolTips, True)
        for child in widget.findChildren(QWidget):
            child.setMouseTracking(True)
            child.setAttribute(Qt.WA_AlwaysShowToolTips, True)

    def _edge_at(self, global_pos):
        """用全局坐标检测鼠标在窗口哪个边缘"""
        geo = self.geometry()
        x = global_pos.x() - geo.x()
        y = global_pos.y() - geo.y()
        w = geo.width()
        h = geo.height()
        edges = []
        if x < self._EDGE_SIZE:
            edges.append("left")
        elif x > w - self._EDGE_SIZE:
            edges.append("right")
        if y < self._EDGE_SIZE:
            edges.append("top")
        elif y > h - self._EDGE_SIZE:
            edges.append("bottom")
        return tuple(edges) if edges else None

    def _cursor_for_edge(self, edge):
        if not edge:
            return Qt.ArrowCursor
        s = set(edge)
        if s == {"left", "top"} or s == {"right", "bottom"}:
            return Qt.SizeFDiagCursor
        if s == {"right", "top"} or s == {"left", "bottom"}:
            return Qt.SizeBDiagCursor
        if "left" in s or "right" in s:
            return Qt.SizeHorCursor
        if "top" in s or "bottom" in s:
            return Qt.SizeVerCursor
        return Qt.ArrowCursor

    def event(self, ev):
        """拦截 HoverMove 事件更新光标"""
        from PySide6.QtCore import QEvent
        if ev.type() == QEvent.HoverMove:
            global_pos = self.mapToGlobal(ev.position().toPoint())
            edge = self._edge_at(global_pos)
            self.setCursor(self._cursor_for_edge(edge))
        return super().event(ev)

    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            global_pos = event.globalPosition().toPoint()
            edge = self._edge_at(global_pos)
            if edge:
                self._resize_edge = edge
                self._resize_start_pos = global_pos
                self._resize_start_geo = self.geometry()
            else:
                # 标题栏区域拖动窗口
                local_y = event.position().y()
                if local_y < 52:
                    self._resize_edge = "move"
                    self._resize_start_pos = global_pos
                    self._resize_start_geo = self.geometry()

    def mouseMoveEvent(self, event):
        if self._resize_edge and self._resize_start_pos:
            global_pos = event.globalPosition().toPoint()
            delta = global_pos - self._resize_start_pos
            geo = self._resize_start_geo

            if self._resize_edge == "move":
                self.move(geo.topLeft() + delta)
                return

            new_geo = geo.adjusted(0, 0, 0, 0)
            if "right" in self._resize_edge:
                new_geo.setRight(geo.right() + delta.x())
            if "bottom" in self._resize_edge:
                new_geo.setBottom(geo.bottom() + delta.y())
            if "left" in self._resize_edge:
                new_geo.setLeft(geo.left() + delta.x())
            if "top" in self._resize_edge:
                new_geo.setTop(geo.top() + delta.y())

            if new_geo.width() >= self.minimumWidth() and new_geo.height() >= self.minimumHeight():
                self.setGeometry(new_geo)
        else:
            global_pos = event.globalPosition().toPoint()
            edge = self._edge_at(global_pos)
            self.setCursor(self._cursor_for_edge(edge))

    def mouseReleaseEvent(self, event):
        self._resize_edge = None
        self._resize_start_pos = None
        self._resize_start_geo = None
        self.setCursor(Qt.ArrowCursor)

    def childMouseMoveEvent(self, child, event):
        """子控件的鼠标移动也检测边缘"""
        global_pos = child.mapToGlobal(event.position().toPoint())
        edge = self._edge_at(global_pos)
        self.setCursor(self._cursor_for_edge(edge))

    def _show_copy_menu(self, bubble, pos):
        """右键复制菜单"""
        menu = QMenu(self)
        copy_action = menu.addAction("复制")
        action = menu.exec(bubble.mapToGlobal(pos))
        if action == copy_action:
            text = bubble.toPlainText()
            QApplication.clipboard().setText(text)

    def clear_messages(self):
        while self.chat_layout.count() > 1:
            item = self.chat_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()


# --------------------------
# 工作线程 - TCP REPL 流式读取
# --------------------------
class ClawTcpWorker(QThread):
    """TCP 模式：连接 claw --serve，保持会话上下文"""
    chunk_received = Signal(str)
    reply_finished = Signal()
    error_occurred = Signal(str)
    connected = Signal()

    def __init__(self, host="127.0.0.1", port=9527):
        super().__init__()
        self.host = host
        self.port = port
        self._stop_flag = False
        self._sock = None
        self._sock_file = None
        self._prompt_queue = []
        self._has_prompt = threading.Event()
        log.debug(f"ClawTcpWorker created, target: {host}:{port}")

    def send_prompt(self, text):
        """发送 prompt（线程安全）"""
        self._prompt_queue.append(("prompt", text))
        self._has_prompt.set()

    def send_reset(self):
        """发送 reset（线程安全）"""
        self._prompt_queue.append(("reset", ""))
        self._has_prompt.set()

    def send_inject(self, messages):
        """发送 inject 注入历史消息（线程安全）"""
        self._prompt_queue.append(("inject", messages))
        self._has_prompt.set()

    def run(self):
        import socket
        import json

        try:
            self._sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self._sock.connect((self.host, self.port))
            self._sock_file = self._sock.makefile('r', encoding='utf-8')
            log.info(f"connected to claw-serve at {self.host}:{self.port}")
        except Exception as e:
            log.error(f"failed to connect: {e}")
            self.error_occurred.emit(f"无法连接 claw-serve ({self.host}:{self.port}): {e}")
            return

        # 读取 ready 消息
        try:
            ready_line = self._sock_file.readline()
            if ready_line:
                ready = json.loads(ready_line)
                log.info(f"ready: {ready}")
                self.connected.emit()
            else:
                self.error_occurred.emit("claw-serve 未发送 ready 消息")
                return
        except Exception as e:
            self.error_occurred.emit(f"读取 ready 失败: {e}")
            return

        # 主循环：等待 prompt，发送，流式读取回复
        while not self._stop_flag:
            self._has_prompt.wait(timeout=0.5)
            if self._stop_flag:
                break
            if not self._prompt_queue:
                self._has_prompt.clear()
                continue

            cmd_type, cmd_text = self._prompt_queue.pop(0)
            if not self._prompt_queue:
                self._has_prompt.clear()

            if cmd_type == "reset":
                # 发送 reset 并读取 reset_done 响应
                try:
                    msg = json.dumps({"type": "reset"}) + "\n"
                    self._sock.sendall(msg.encode("utf-8"))
                    log.info("sent reset")
                    # 读取 reset_done 响应（设置超时避免阻塞）
                    self._sock.settimeout(10.0)
                    line = self._sock_file.readline()
                    self._sock.settimeout(None)
                    if line:
                        resp = json.loads(line.strip())
                        log.info(f"reset response: {resp}")
                    else:
                        log.warning("reset: empty response (server may have closed)")
                except Exception as e:
                    log.error(f"reset error: {e}")
                    self._sock.settimeout(None)
                continue

            if cmd_type == "inject":
                # 发送 inject 并读取 inject_done 响应
                try:
                    msg = json.dumps({"type": "inject", "messages": cmd_text}, ensure_ascii=False) + "\n"
                    self._sock.sendall(msg.encode("utf-8"))
                    log.info(f"sent inject with {len(cmd_text)} messages")
                    self._sock.settimeout(10.0)
                    line = self._sock_file.readline()
                    self._sock.settimeout(None)
                    if line:
                        resp = json.loads(line.strip())
                        log.info(f"inject response: {resp}")
                    else:
                        log.warning("inject: empty response")
                except Exception as e:
                    log.error(f"inject error: {e}")
                    self._sock.settimeout(None)
                continue

            # 发送 prompt
            try:
                msg = json.dumps({"type": "prompt", "text": cmd_text}, ensure_ascii=False)
                self._sock.sendall((msg + "\n").encode("utf-8"))
                log.info(f"sent prompt: {cmd_text[:60]}...")
            except Exception as e:
                log.error(f"send error: {e}")
                self.error_occurred.emit(f"发送失败: {e}")
                continue

            # 流式读取回复
            try:
                while True:
                    line = self._sock_file.readline()
                    if not line:
                        log.warning("connection closed by server")
                        self.error_occurred.emit("连接已断开")
                        self._stop_flag = True
                        break
                    line = line.strip()
                    if not line:
                        continue
                    resp = json.loads(line)
                    resp_type = resp.get("type", "")

                    if resp_type == "chunk":
                        text = resp.get("text", "")
                        if text:
                            self.chunk_received.emit(text)
                    elif resp_type == "done":
                        log.info("reply done")
                        self.reply_finished.emit()
                        break
                    elif resp_type == "error":
                        err_text = resp.get("text", "未知错误")
                        log.error(f"server error: {err_text}")
                        self.error_occurred.emit(err_text)
                        break
                    elif resp_type == "usage":
                        log.debug(f"usage: {resp}")
                    elif resp_type == "tool_start":
                        log.debug(f"tool: {resp}")
                    else:
                        log.debug(f"unknown resp: {resp}")
            except Exception as e:
                log.error(f"read error: {e}")
                self.error_occurred.emit(f"读取回复失败: {e}")

        # 发送 exit
        try:
            if self._sock:
                msg = json.dumps({"type": "exit"}) + "\n"
                self._sock.sendall(msg.encode("utf-8"))
                self._sock.close()
        except Exception:
            pass
        log.info("TCP worker stopped")

    def stop(self):
        log.debug("stop() called")
        self._stop_flag = True
        self._has_prompt.set()  # 唤醒等待


class ClawReplWorker(QThread):
    """单次 prompt 模式（备用），逐行流式读取 stdout"""
    chunk_received = Signal(str)
    reply_finished = Signal()
    error_occurred = Signal(str)

    def __init__(self, env, cwd, prompt_text):
        super().__init__()
        self.env = env
        self.cwd = cwd
        self.prompt_text = prompt_text
        self._stop_flag = False
        log.debug(f"ClawReplWorker created, prompt: {prompt_text[:80]}...")

    def run(self):
        claw_path = os.path.join(self.cwd, "rust", "target", "release", "claw.exe")
        # 从环境变量读取模型名，自动添加 openai/ 前缀
        model = self.env.get("CLAW_MODEL", "openai/deepseek-chat")
        if not model.startswith(("openai/", "anthropic/", "xai/", "qwen/", "kimi/", "claude")):
            model = f"openai/{model}"
        cmd = [claw_path, "--output-format", "text", "--compact",
               "--dangerously-skip-permissions",
               "--model", model,
               "prompt", self.prompt_text]

        log.info(f"spawning claw: {claw_path}")
        log.debug(f"cmd: {' '.join(cmd[:8])}...")
        log.debug(f"cwd: {self.cwd}")
        log.debug(f"env OPENAI_BASE_URL: {self.env.get('OPENAI_BASE_URL', 'not set')}")
        log.debug(f"env OPENAI_API_KEY: {self.env.get('OPENAI_API_KEY', 'not set')[:15]}...")
        log.debug(f"env CLAW_MODEL: {self.env.get('CLAW_MODEL', 'not set')}")

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
            log.info(f"child process started, pid: {process.pid}")
        except Exception as e:
            log.error(f"failed to spawn claw: {e}")
            self.error_occurred.emit(f"启动 claw 失败: {e}")
            return

        # 后台读 stderr
        def drain_stderr():
            try:
                for raw_line in iter(process.stderr.readline, b''):
                    if self._stop_flag:
                        break
                    line = raw_line.decode("utf-8", errors="replace").rstrip()
                    if line:
                        log.debug(f"[stderr] {line}")
            except Exception:
                pass

        threading.Thread(target=drain_stderr, daemon=True).start()

        # 逐行流式读取 stdout
        chunk_count = 0
        try:
            for raw_line in iter(process.stdout.readline, b''):
                if self._stop_flag:
                    log.warning("stop flag set, breaking read loop")
                    break
                line = raw_line.decode("utf-8", errors="replace").rstrip("\r\n")
                if line:
                    chunk_count += 1
                    if chunk_count <= 3:
                        log.debug(f"[stdout chunk {chunk_count}] {line[:100]}")
                    self.chunk_received.emit(line + "\n")
        except Exception as e:
            log.error(f"error reading stdout: {e}")

        exit_code = process.wait()
        log.info(f"child exited, code: {exit_code}, total chunks: {chunk_count}")
        self.reply_finished.emit()

    def stop(self):
        log.debug("stop() called")
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
    quit_requested = Signal()

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setStyleSheet("QMenu { background: white; border-radius: 10px; padding: 6px 0; min-width: 140px; border: 1px solid #e5e7eb; } QMenu::item { padding: 10px 18px; font-size: 14px; font-family: Arial, 'Microsoft YaHei'; color: #333; } QMenu::item:selected { background: #f3f4f6; }")
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
        self.addSeparator()
        a4 = QAction("\u274c 退出", self)
        a4.triggered.connect(self.quit_requested.emit)
        self.addAction(a4)


# --------------------------
# 设置界面
# --------------------------
class SettingsDialog(QWidget):
    """设置界面 - 双页面：API 配置 / Skills 管理"""
    settings_saved = Signal()

    def __init__(self, project_dir, parent=None):
        super().__init__(parent)
        self.project_dir = project_dir
        self.config_path = os.path.join(project_dir, ".claw", "chatbox_settings.json")
        self.skills_dir = os.path.join(project_dir, ".claw", "skills")
        self.setWindowTitle("设置")
        self.setFixedSize(480, 540)
        self.setWindowFlags(Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setup_ui()
        self.load_settings()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # --- 顶部 Tab 栏 ---
        tab_bar = QWidget()
        tab_bar.setFixedHeight(44)
        tab_bar.setStyleSheet("background: #f8fafc; border-bottom: 1px solid #e2e8f0;")
        tab_layout = QHBoxLayout(tab_bar)
        tab_layout.setContentsMargins(16, 0, 16, 0)
        tab_layout.setSpacing(0)

        self.tab_api = QPushButton("API 配置")
        self.tab_skills = QPushButton("Skills 管理")
        for btn in (self.tab_api, self.tab_skills):
            btn.setFixedHeight(44)
            btn.setCursor(QCursor(Qt.PointingHandCursor))
        self.tab_api.clicked.connect(lambda: self._switch_page(0))
        self.tab_skills.clicked.connect(lambda: self._switch_page(1))
        tab_layout.addWidget(self.tab_api)
        tab_layout.addWidget(self.tab_skills)
        tab_layout.addStretch()
        layout.addWidget(tab_bar)

        # --- StackedWidget ---
        from PySide6.QtWidgets import QStackedWidget
        self.stack = QStackedWidget()
        layout.addWidget(self.stack)

        self.stack.addWidget(self._build_api_page())
        self.stack.addWidget(self._build_skills_page())
        self._switch_page(0)

    def _switch_page(self, index):
        self.stack.setCurrentIndex(index)
        active_style = "QPushButton { border: none; border-bottom: 3px solid #1e9bd7; color: #1e9bd7; font-size: 14px; font-weight: bold; padding: 0 16px; }"
        inactive_style = "QPushButton { border: none; border-bottom: 3px solid transparent; color: #64748b; font-size: 14px; padding: 0 16px; } QPushButton:hover { color: #334155; }"
        self.tab_api.setStyleSheet(active_style if index == 0 else inactive_style)
        self.tab_skills.setStyleSheet(active_style if index == 1 else inactive_style)
        if index == 1:
            self._refresh_skills_list()

    def _build_api_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(14)

        layout.addWidget(self._label("API Provider"))
        self.provider_combo = QComboBox()
        self.provider_combo.addItems(["Anthropic (Claude)", "OpenAI (GPT)", "xAI (Grok)", "DashScope (通义/Kimi)", "自定义 OpenAI 兼容"])
        self.provider_combo.setStyleSheet("QComboBox { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; }")
        self.provider_combo.currentIndexChanged.connect(self._on_provider_changed)
        layout.addWidget(self.provider_combo)

        layout.addWidget(self._label("API Key"))
        self.api_key_input = QTextEdit()
        self.api_key_input.setFixedHeight(36)
        self.api_key_input.setPlaceholderText("sk-ant-xxx")
        self.api_key_input.setStyleSheet(self._input_style())
        self.api_key_input.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        layout.addWidget(self.api_key_input)

        layout.addWidget(self._label("Base URL (留空使用默认)"))
        self.base_url_input = QTextEdit()
        self.base_url_input.setFixedHeight(36)
        self.base_url_input.setPlaceholderText("https://api.anthropic.com")
        self.base_url_input.setStyleSheet(self._input_style())
        self.base_url_input.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        layout.addWidget(self.base_url_input)

        layout.addWidget(self._label("模型名称"))
        self.model_input = QTextEdit()
        self.model_input.setFixedHeight(36)
        self.model_input.setPlaceholderText("claude-sonnet-4-6")
        self.model_input.setStyleSheet(self._input_style())
        self.model_input.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        layout.addWidget(self.model_input)

        layout.addStretch()
        btn_row = QHBoxLayout()
        btn_row.addStretch()
        save_btn = QPushButton("保存")
        save_btn.setFixedSize(100, 36)
        save_btn.setStyleSheet("QPushButton { background: #1e9bd7; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; } QPushButton:hover { background: #178ab8; }")
        save_btn.clicked.connect(self._save_api_settings)
        btn_row.addWidget(save_btn)
        layout.addLayout(btn_row)
        return page

    def _build_skills_page(self):
        page = QWidget()
        layout = QVBoxLayout(page)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(12)

        header = QHBoxLayout()
        header.addWidget(self._label("已安装 Skills"))
        header.addStretch()
        add_btn = QPushButton("＋ 添加")
        add_btn.setFixedHeight(30)
        add_btn.setStyleSheet("QPushButton { background: #1e9bd7; color: white; border: none; border-radius: 6px; font-size: 13px; padding: 0 12px; } QPushButton:hover { background: #178ab8; }")
        add_btn.clicked.connect(self._add_skill)
        header.addWidget(add_btn)
        layout.addLayout(header)

        self.skills_list = QListWidget()
        self.skills_list.setStyleSheet("""
            QListWidget { border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 13px; }
            QListWidget::item { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; }
            QListWidget::item:selected { background: #eff6ff; color: #1e40af; }
        """)
        layout.addWidget(self.skills_list)

        bottom_row = QHBoxLayout()
        open_dir_btn = QPushButton("打开目录")
        open_dir_btn.setFixedHeight(32)
        open_dir_btn.setStyleSheet("QPushButton { background: #f1f5f9; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; padding: 0 12px; } QPushButton:hover { background: #e2e8f0; }")
        open_dir_btn.clicked.connect(self._open_skills_dir)
        bottom_row.addWidget(open_dir_btn)

        del_btn = QPushButton("删除选中")
        del_btn.setFixedHeight(32)
        del_btn.setStyleSheet("QPushButton { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; font-size: 13px; padding: 0 12px; color: #dc2626; } QPushButton:hover { background: #fee2e2; }")
        del_btn.clicked.connect(self._delete_skill)
        bottom_row.addWidget(del_btn)
        bottom_row.addStretch()
        layout.addLayout(bottom_row)
        return page

    def _label(self, text):
        lbl = QLabel(text)
        lbl.setStyleSheet("font-size: 13px; font-weight: bold; color: #475569;")
        return lbl

    def _input_style(self):
        return "QTextEdit { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; font-family: Consolas, monospace; }"

    def _on_provider_changed(self, index):
        placeholders = [
            ("sk-ant-xxx", "https://api.anthropic.com", "claude-sonnet-4-6"),
            ("sk-xxx", "https://api.openai.com/v1", "gpt-4o"),
            ("xai-xxx", "https://api.x.ai/v1", "grok-3"),
            ("sk-xxx", "https://dashscope.aliyuncs.com/compatible-mode/v1", "kimi-k2.5"),
            ("sk-xxx", "http://localhost:11434/v1", "your-model"),
        ]
        if 0 <= index < len(placeholders):
            key_ph, url_ph, model_ph = placeholders[index]
            self.api_key_input.setPlaceholderText(key_ph)
            self.base_url_input.setPlaceholderText(url_ph)
            self.model_input.setPlaceholderText(model_ph)

    def _refresh_skills_list(self):
        self.skills_list.clear()
        if not os.path.isdir(self.skills_dir):
            return
        for name in sorted(os.listdir(self.skills_dir)):
            skill_path = os.path.join(self.skills_dir, name)
            if os.path.isdir(skill_path) and os.path.isfile(os.path.join(skill_path, "SKILL.md")):
                desc = ""
                try:
                    import re
                    with open(os.path.join(skill_path, "SKILL.md"), "r", encoding="utf-8") as f:
                        content = f.read()
                    m = re.search(r'^description:\s*[|]?\s*\n?\s*(.+?)(?:\n---|\n\w)', content, re.MULTILINE | re.DOTALL)
                    if not m:
                        m = re.search(r'^description:\s*(.+)$', content, re.MULTILINE)
                    if m:
                        desc = m.group(1).strip().strip('"').strip("'")[:60]
                except Exception:
                    pass
                item = QListWidgetItem(f"📦 {name}" + (f"\n     {desc}" if desc else ""))
                item.setData(Qt.UserRole, name)
                self.skills_list.addItem(item)

    def _add_skill(self):
        dir_path = QFileDialog.getExistingDirectory(self, "选择 Skill 文件夹", self.project_dir)
        if not dir_path:
            return
        skill_md = os.path.join(dir_path, "SKILL.md")
        if not os.path.isfile(skill_md):
            reply = QMessageBox.question(self, "创建 Skill",
                f"该文件夹没有 SKILL.md，是否创建模板？\n\n{dir_path}",
                QMessageBox.Yes | QMessageBox.No)
            if reply == QMessageBox.No:
                return
            skill_name = os.path.basename(dir_path)
            template = f"---\nname: {skill_name}\ndescription: 在此描述功能\n---\n\n# {skill_name}\n\n在此编写指令。\n"
            with open(skill_md, "w", encoding="utf-8") as f:
                f.write(template)

        skill_name = os.path.basename(dir_path)
        target = os.path.join(self.skills_dir, skill_name)
        if os.path.exists(target):
            QMessageBox.warning(self, "已存在", f"Skill '{skill_name}' 已存在。")
            return
        import shutil
        os.makedirs(self.skills_dir, exist_ok=True)
        shutil.copytree(dir_path, target)
        self._refresh_skills_list()
        QMessageBox.information(self, "添加成功", f"Skill '{skill_name}' 已添加。")

    def _delete_skill(self):
        item = self.skills_list.currentItem()
        if not item:
            return
        name = item.data(Qt.UserRole)
        reply = QMessageBox.question(self, "确认删除",
            f"确定删除 skill '{name}'？不可恢复。",
            QMessageBox.Yes | QMessageBox.No)
        if reply == QMessageBox.Yes:
            import shutil
            shutil.rmtree(os.path.join(self.skills_dir, name), ignore_errors=True)
            self._refresh_skills_list()

    def _open_skills_dir(self):
        os.makedirs(self.skills_dir, exist_ok=True)
        os.startfile(self.skills_dir)

    def _save_api_settings(self):
        import json
        provider_index = self.provider_combo.currentIndex()
        api_key = self.api_key_input.toPlainText().strip()
        base_url = self.base_url_input.toPlainText().strip()
        model = self.model_input.toPlainText().strip()

        env_map = [
            ("ANTHROPIC_API_KEY", "ANTHROPIC_BASE_URL"),
            ("OPENAI_API_KEY", "OPENAI_BASE_URL"),
            ("XAI_API_KEY", "XAI_BASE_URL"),
            ("DASHSCOPE_API_KEY", "DASHSCOPE_BASE_URL"),
            ("OPENAI_API_KEY", "OPENAI_BASE_URL"),
        ]
        key_env, url_env = env_map[provider_index]

        config = {"provider_index": provider_index, "api_key_env": key_env, "api_key": api_key, "base_url_env": url_env, "base_url": base_url, "model": model}
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2, ensure_ascii=False)

        # 生成环境变量脚本，根据 provider 正确设置对应的环境变量
        ps_path = os.path.join(self.project_dir, "set-anthropic-env.ps1")
        lines = []
        if api_key:
            lines.append(f'$env:{key_env} = "{api_key}"')
        if base_url:
            lines.append(f'$env:{url_env} = "{base_url}"')
        if model:
            lines.append(f'$env:CLAW_MODEL = "{model}"')
        if lines:
            with open(ps_path, "w", encoding="utf-8") as f:
                f.write("\n".join(lines) + "\n")

        self.settings_saved.emit()
        self.hide()
        QMessageBox.information(self, "保存成功", "API 设置已保存，重启后生效。")

    def load_settings(self):
        import json
        if not os.path.exists(self.config_path):
            return
        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
            self.provider_combo.setCurrentIndex(config.get("provider_index", 0))
            self.api_key_input.setPlainText(config.get("api_key", ""))
            self.base_url_input.setPlainText(config.get("base_url", ""))
            self.model_input.setPlainText(config.get("model", ""))
        except Exception as e:
            log.error(f"load settings failed: {e}")


# --------------------------
# 主程序
# --------------------------
class FrontierApp:
    def __init__(self):
        self.conversations = []
        self.current_conv_id = None
        self.repl_worker = None
        self.tcp_worker = None
        self.streaming_bubble = None
        self.current_reply = ""
        self._claw_process = None

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
        self.chat_window.show_history.connect(self.on_show_history)
        self.chat_window.attach_requested.connect(self.on_attach)
        self.context_menu.about_requested.connect(
            lambda: QMessageBox.about(self.chat_window, "关于", "Frontier 助手 v1.0"))
        self.context_menu.quit_requested.connect(self._quit_app)

        # 设置界面
        self.settings_dialog = SettingsDialog(self.project_dir)
        self.context_menu.settings_requested.connect(self._show_settings)

        self.init_first_conversation()
        self.float_ball.show()

        # 启动 claw --serve 并连接 TCP
        self._start_claw_serve()

    def load_env(self):
        import re
        env = os.environ.copy()
        ps_script = os.path.join(self.project_dir, "set-anthropic-env.ps1")
        log.info(f"loading env from: {ps_script}")
        if os.path.exists(ps_script):
            try:
                # 直接解析 ps1 文件中的 $env:KEY = "VALUE" 行
                with open(ps_script, "r", encoding="utf-8") as f:
                    for line in f:
                        m = re.match(r'\$env:(\w+)\s*=\s*"(.+?)"', line.strip())
                        if m:
                            key, value = m.group(1), m.group(2)
                            env[key] = value
                            log.debug(f"  env loaded: {key}={value[:15]}...")
                log.info("env loaded successfully")
            except Exception as e:
                log.error(f"failed to load env: {e}")
        else:
            log.warning(f"env script not found: {ps_script}")
        return env

    def init_first_conversation(self):
        # 尝试从磁盘加载历史会话
        self._load_conversations()
        if self.conversations:
            # 恢复最后一个会话
            self.current_conv_id = self.conversations[-1]['id']
            self.chat_window.add_message("你好！我是Hexagon助手，你可以问我各种问题～", is_user=False)
            # 显示最后一个会话的消息
            conv = self._current_conv()
            if conv and conv['messages']:
                for msg in conv['messages']:
                    if msg['role'] == 'user':
                        self.chat_window.add_message(msg['text'], is_user=True)
                    else:
                        display = self.format_markdown(msg['text'])
                        self.chat_window.add_message(display, is_user=False)
        else:
            conv = {'id': 1, 'title': '新对话', 'time': '刚刚', 'messages': []}
            self.conversations.append(conv)
            self.current_conv_id = conv['id']
            self.chat_window.add_message("你好！我是Hexagon助手，你可以问我各种问题～", is_user=False)

    def _conversations_path(self):
        return os.path.join(self.project_dir, ".claw", "chatbox_history.json")

    def _save_conversations(self):
        """保存所有会话到磁盘"""
        import json
        path = self._conversations_path()
        os.makedirs(os.path.dirname(path), exist_ok=True)
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(self.conversations, f, ensure_ascii=False, indent=2)
        except Exception as e:
            log.error(f"save conversations failed: {e}")

    def _load_conversations(self):
        """从磁盘加载会话"""
        import json
        path = self._conversations_path()
        if not os.path.exists(path):
            return
        try:
            with open(path, "r", encoding="utf-8") as f:
                self.conversations = json.load(f)
            log.info(f"loaded {len(self.conversations)} conversations from disk")
        except Exception as e:
            log.error(f"load conversations failed: {e}")
            self.conversations = []

    def _start_claw_serve(self):
        """启动 claw --serve 子进程并通过 TCP 连接"""
        import time
        claw_path = os.path.join(self.project_dir, "rust", "target", "release", "claw.exe")
        if not os.path.exists(claw_path):
            log.error(f"claw.exe not found: {claw_path}")
            return

        port = 9527
        log.info(f"starting claw --serve {port}...")

        # 确保 PATH 中包含 Git 的 sh.exe（claw 的 bash 工具需要）
        env = self.env.copy()
        git_paths = [
            r"C:\Program Files\Git\bin",
            r"C:\Program Files\Git\usr\bin",
            r"C:\Program Files (x86)\Git\bin",
        ]
        current_path = env.get("PATH", "")
        for gp in git_paths:
            if os.path.isdir(gp) and gp not in current_path:
                current_path = gp + ";" + current_path
        env["PATH"] = current_path

        try:
            # 模型名从环境变量 CLAW_MODEL 读取（由设置界面保存）
            model = env.get("CLAW_MODEL", "openai/deepseek-chat")
            # 非 Anthropic 模型需要 openai/ 前缀让 claw 走 OpenAI 兼容路径
            if not model.startswith(("openai/", "anthropic/", "xai/", "qwen/", "kimi/", "claude")):
                model = f"openai/{model}"
            log.info(f"claw-serve model: {model}, CLAW_MODEL env: {env.get('CLAW_MODEL', 'NOT SET')}, OPENAI_BASE_URL: {env.get('OPENAI_BASE_URL', 'NOT SET')}")
            self._claw_process = subprocess.Popen(
                [claw_path, "--model", model,
                 "--dangerously-skip-permissions",
                 "--serve", str(port)],
                stdin=subprocess.DEVNULL,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
                cwd=self.project_dir,
                creationflags=subprocess.CREATE_NO_WINDOW,
            )
            log.info(f"claw-serve started, pid: {self._claw_process.pid}")
        except Exception as e:
            log.error(f"failed to start claw-serve: {e}")
            return

        # 后台读 stderr
        def drain_claw_stderr():
            try:
                for raw_line in iter(self._claw_process.stderr.readline, b''):
                    line = raw_line.decode("utf-8", errors="replace").rstrip()
                    if line:
                        log.debug(f"[claw-serve] {line}")
            except Exception:
                pass
        threading.Thread(target=drain_claw_stderr, daemon=True).start()

        # 等待服务启动
        time.sleep(1.5)

        # 启动 TCP worker
        self.tcp_worker = ClawTcpWorker("127.0.0.1", port)
        self.tcp_worker.chunk_received.connect(self.on_chunk_received)
        self.tcp_worker.reply_finished.connect(self.on_reply_finished)
        self.tcp_worker.error_occurred.connect(self.on_repl_error)
        self.tcp_worker.connected.connect(lambda: log.info("TCP connected to claw-serve"))
        self.tcp_worker.start()

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

    def _show_settings(self):
        """显示设置界面"""
        self.settings_dialog.show()
        self.settings_dialog.raise_()
        self.settings_dialog.activateWindow()

    def _quit_app(self):
        """退出程序"""
        reply = QMessageBox.question(
            self.chat_window, "退出确认",
            "确定要退出 Frontier 助手吗？",
            QMessageBox.Yes | QMessageBox.No)
        if reply != QMessageBox.Yes:
            return
        if self.tcp_worker and self.tcp_worker.isRunning():
            self.tcp_worker.stop()
            self.tcp_worker.wait(2000)
        if self._claw_process:
            self._claw_process.terminate()
        QApplication.quit()

    def on_send(self, text):
        log.info(f"user sent: {text[:60]}...")
        self.chat_window.add_message(text, is_user=True)

        # 保存用户消息到当前会话
        conv = self._current_conv()
        if conv:
            conv['messages'].append({'role': 'user', 'text': text})
            if conv['title'] == '新对话' and len(conv['messages']) == 1:
                conv['title'] = text[:20] + ('...' if len(text) > 20 else '')
            self._save_conversations()

        # 创建流式气泡
        self.streaming_bubble = self.chat_window.add_message(
            '<span style="color:#9ca3af;">Thinking...</span>', is_user=False)
        self.current_reply = ""
        self._thinking_seconds = 0
        self._thinking_timer = QTimer()
        self._thinking_timer.timeout.connect(self._update_thinking)
        self._thinking_timer.start(1000)

        self.chat_window.btn_send.setEnabled(False)
        self.chat_window.btn_send.setText("等待中")

        # TCP REPL 模式：直接发送用户文本（不加系统上下文，由 claw-serve 管理）
        if self.tcp_worker and self.tcp_worker.isRunning():
            log.info("sending via TCP REPL...")
            self.tcp_worker.send_prompt(text)
        else:
            # 回退到单次 prompt 模式
            log.info("TCP not available, falling back to ClawReplWorker...")
            system_ctx = (
                "[系统上下文] 你是 Frontier 助手，基于 claw-code 运行。"
                "当前项目已安装以下 skills（位于 .claw/skills/ 目录）："
                "1. sysinfo - 查询本机电脑硬件和系统配置信息"
                "2. pc-dmis-automation - PC-DMIS 自动化编程辅助"
                "Skills 存放在 .claw/skills/<name>/SKILL.md 中。"
                "请基于实际情况回答问题。\n\n"
            )
            full_prompt = system_ctx + text
            self.repl_worker = ClawReplWorker(self.env, self.project_dir, full_prompt)
            self.repl_worker.chunk_received.connect(self.on_chunk_received)
            self.repl_worker.reply_finished.connect(self.on_reply_finished)
            self.repl_worker.error_occurred.connect(self.on_repl_error)
            self.repl_worker.start()

    def on_chunk_received(self, chunk):
        # 停止 thinking 计时器
        if hasattr(self, '_thinking_timer') and self._thinking_timer:
            self._thinking_timer.stop()
            self._thinking_timer = None
        # 静默恢复模式：不显示
        if getattr(self, '_silent_restore', False):
            return
        if self.streaming_bubble:
            self.current_reply += chunk
            # SSE 流式：每收到 chunk 立即渲染
            display = self.format_markdown(self.current_reply)
            self.streaming_bubble.setHtml(display)
            # 调整高度
            doc = self.streaming_bubble.document()
            w = self.streaming_bubble.viewport().width()
            if w > 0:
                doc.setTextWidth(w)
            h = int(doc.size().height()) + 20
            self.streaming_bubble.setMinimumHeight(h)
            self.streaming_bubble.setFixedHeight(h)
            self.chat_window.scroll_to_bottom()

    def _update_thinking(self):
        """更新 Thinking 计时"""
        self._thinking_seconds += 1
        if self.streaming_bubble and not self.current_reply:
            dots = "." * ((self._thinking_seconds % 3) + 1)
            self.streaming_bubble.setHtml(
                f'<span style="color:#9ca3af;">🤔 Thinking{dots} ({self._thinking_seconds}s)</span>'
            )

    def on_reply_finished(self):
        # 停止 thinking 计时器
        if hasattr(self, '_thinking_timer') and self._thinking_timer:
            self._thinking_timer.stop()
            self._thinking_timer = None
        # 静默恢复模式：完成后退出静默
        if getattr(self, '_silent_restore', False):
            self._silent_restore = False
            log.info("silent restore done, context recovered")
            return
        log.info(f"reply finished, total length: {len(self.current_reply)}")
        if self.streaming_bubble and self.current_reply:
            display = self.format_markdown(self.current_reply)
            self.streaming_bubble.setHtml(display)
            # 最终调整高度（使用延迟确保布局完成）
            bubble = self.streaming_bubble
            def final_adjust():
                doc = bubble.document()
                w = bubble.viewport().width()
                if w > 0:
                    doc.setTextWidth(w)
                h = int(doc.size().height()) + 20
                bubble.setMinimumHeight(h)
                bubble.setFixedHeight(h)
                self.chat_window.scroll_to_bottom()
            QTimer.singleShot(50, final_adjust)
            QTimer.singleShot(200, final_adjust)
        # 保存助手回复到当前会话
        if self.current_reply:
            conv = self._current_conv()
            if conv:
                conv['messages'].append({'role': 'assistant', 'text': self.current_reply})
            self._save_conversations()
        self.chat_window.btn_send.setEnabled(True)
        self.chat_window.btn_send.setText("发送")
        self.streaming_bubble = None

    def format_markdown(self, text):
        """将 Markdown 文本格式化为富文本 HTML"""
        import re

        # 处理代码块 ```lang ... ```
        def replace_code_block(match):
            lang = match.group(1) or ""
            code = match.group(2).strip()
            code = code.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            lang_label = f'<div style="background:#e2e8f0; padding:2px 8px; border-radius:4px 4px 0 0; font-size:11px; color:#475569; font-family:Consolas,monospace;">{lang}</div>' if lang else ''
            return (f'{lang_label}'
                    f'<div style="background:#1e293b; color:#e2e8f0; padding:10px 12px; '
                    f'border-radius:{"0 0 6px 6px" if lang else "6px"}; '
                    f'margin:4px 0 8px 0; font-family:Consolas,\'Courier New\',monospace; font-size:12px; '
                    f'white-space:pre-wrap; line-height:1.5;">{code}</div>')

        text = re.sub(r'```(\w*)\n?(.*?)```', replace_code_block, text, flags=re.DOTALL)

        # 行内代码
        text = re.sub(r'`([^`]+)`',
                      r'<code style="background:#f1f5f9; padding:2px 5px; border-radius:3px; font-family:Consolas,monospace; font-size:12px; color:#e11d48;">\1</code>',
                      text)

        # 加粗
        text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)

        # 斜体
        text = re.sub(r'\*(.+?)\*', r'<i>\1</i>', text)

        # 标题
        text = re.sub(r'^### (.+)$', r'<div style="font-size:14px; font-weight:bold; margin:8px 0 4px 0; color:#1e293b;">\1</div>', text, flags=re.MULTILINE)
        text = re.sub(r'^## (.+)$', r'<div style="font-size:15px; font-weight:bold; margin:10px 0 5px 0; color:#0f172a;">\1</div>', text, flags=re.MULTILINE)
        text = re.sub(r'^# (.+)$', r'<div style="font-size:16px; font-weight:bold; margin:12px 0 6px 0; color:#0f172a;">\1</div>', text, flags=re.MULTILINE)

        # 分隔线
        text = re.sub(r'^---+$', r'<hr style="border:none; border-top:1px solid #e2e8f0; margin:8px 0;">', text, flags=re.MULTILINE)

        # 无序列表
        text = re.sub(r'^- (.+)$', r'<div style="margin:2px 0 2px 12px;">• \1</div>', text, flags=re.MULTILINE)
        text = re.sub(r'^\* (.+)$', r'<div style="margin:2px 0 2px 12px;">• \1</div>', text, flags=re.MULTILINE)

        # 有序列表
        def replace_ordered_list(match):
            num = match.group(1)
            content = match.group(2)
            return f'<div style="margin:2px 0 2px 12px;">{num}. {content}</div>'
        text = re.sub(r'^(\d+)\. (.+)$', replace_ordered_list, text, flags=re.MULTILINE)

        # 引用块
        text = re.sub(r'^> (.+)$',
                      r'<div style="border-left:3px solid #94a3b8; padding:4px 10px; margin:4px 0; color:#64748b; background:#f8fafc;">\1</div>',
                      text, flags=re.MULTILINE)

        # 表格简单处理（Markdown 表格 → HTML 表格）
        def replace_table(match):
            table_text = match.group(0)
            rows = table_text.strip().split('\n')
            html = '<table style="border-collapse:collapse; margin:6px 0; font-size:12px; width:100%;">'
            for i, row in enumerate(rows):
                if re.match(r'^\|[\s\-:]+\|$', row):
                    continue  # 跳过分隔行
                cells = [c.strip() for c in row.split('|')[1:-1]]
                tag = 'th' if i == 0 else 'td'
                style = 'padding:4px 8px; border:1px solid #e2e8f0; background:#f8fafc; font-weight:bold;' if i == 0 else 'padding:4px 8px; border:1px solid #e2e8f0;'
                html += '<tr>' + ''.join(f'<{tag} style="{style}">{c}</{tag}>' for c in cells) + '</tr>'
            html += '</table>'
            return html

        text = re.sub(r'(\|.+\|[\r\n]+)+', replace_table, text)

        # 换行
        text = text.replace("\n", "<br>")

        # 清理多余的 <br>
        text = re.sub(r'(<br>){3,}', '<br><br>', text)
        text = re.sub(r'<div([^>]*)><br>', r'<div\1>', text)
        text = re.sub(r'<br></div>', '</div>', text)

        return text

    def on_repl_error(self, err):
        log.error(f"repl error: {err}")
        # 停止 thinking 计时器
        if hasattr(self, '_thinking_timer') and self._thinking_timer:
            self._thinking_timer.stop()
            self._thinking_timer = None
        # 静默恢复模式：忽略错误
        if getattr(self, '_silent_restore', False):
            self._silent_restore = False
            log.warning(f"silent restore error (ignored): {err}")
            return
        # 上下文窗口溢出时自动重置会话
        if "context_window_blocked" in err.lower() or "Context window blocked" in err:
            log.warning("context window blocked, auto-resetting session...")
            if self.tcp_worker and self.tcp_worker.isRunning():
                self.tcp_worker.send_reset()
            if self.streaming_bubble:
                self.streaming_bubble.setHtml("⚠️ 上下文窗口已满，已自动重置会话。请重新发送消息。")
            else:
                self.chat_window.add_message("⚠️ 上下文窗口已满，已自动重置会话。请重新发送消息。", is_user=False)
            self.chat_window.btn_send.setEnabled(True)
            self.chat_window.btn_send.setText("发送")
            self.streaming_bubble = None
            return
        if self.streaming_bubble:
            self.streaming_bubble.setHtml(f"\u26a0\ufe0f {err}")
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
        # TCP 模式：发送 reset 重置会话
        if self.tcp_worker and self.tcp_worker.isRunning():
            self.tcp_worker.send_reset()
        import time
        conv = {'id': len(self.conversations) + 1, 'title': '新对话', 'time': time.strftime('%H:%M'), 'messages': []}
        self.conversations.append(conv)
        self.current_conv_id = conv['id']
        self.chat_window.clear_messages()
        self.chat_window.add_message("你好！我是Hexagon助手，你可以问我各种问题～", is_user=False)
        self._save_conversations()

    def _current_conv(self):
        """获取当前会话"""
        for conv in self.conversations:
            if conv['id'] == self.current_conv_id:
                return conv
        return None

    def on_show_history(self):
        """显示历史会话列表"""
        if len(self.conversations) <= 1:
            QMessageBox.information(self.chat_window, "历史记录", "暂无历史会话。")
            return

        # 创建历史会话弹窗
        dialog = QWidget(self.chat_window)
        dialog.setWindowTitle("历史会话")
        dialog.setWindowFlags(Qt.WindowStaysOnTopHint | Qt.Tool)
        dialog.setFixedSize(300, 400)
        dialog.setAttribute(Qt.WA_DeleteOnClose)

        layout = QVBoxLayout(dialog)
        layout.setContentsMargins(12, 12, 12, 12)
        layout.setSpacing(8)

        title = QLabel("📋 历史会话")
        title.setStyleSheet("font-size: 15px; font-weight: bold; color: #1e293b;")
        layout.addWidget(title)

        history_list = QListWidget()
        history_list.setStyleSheet("""
            QListWidget { border: 1px solid #e2e8f0; border-radius: 8px; background: white; }
            QListWidget::item { padding: 0px; border-bottom: 1px solid #f1f5f9; }
            QListWidget::item:selected { background: #eff6ff; }
        """)

        def populate_list():
            history_list.clear()
            for conv in reversed(self.conversations):
                msg_count = len(conv['messages'])
                current_mark = "  ◀ 当前" if conv['id'] == self.current_conv_id else ""

                item_widget = QWidget()
                item_widget.setStyleSheet("background: transparent;")
                item_layout = QHBoxLayout(item_widget)
                item_layout.setContentsMargins(8, 8, 8, 8)
                item_layout.setSpacing(8)

                # 删除按钮（非当前会话才显示）
                if conv['id'] != self.current_conv_id:
                    del_btn = QPushButton("✕")
                    del_btn.setFixedSize(24, 24)
                    del_btn.setToolTip("删除此会话")
                    del_btn.setStyleSheet("QPushButton { border: none; color: #ef4444; font-size: 15px; font-weight: bold; border-radius: 12px; background: transparent; } QPushButton:hover { background: #fee2e2; }")
                    conv_id = conv['id']
                    del_btn.clicked.connect(lambda checked=False, cid=conv_id: delete_conv(cid))
                    item_layout.addWidget(del_btn)
                else:
                    spacer = QWidget()
                    spacer.setFixedWidth(24)
                    item_layout.addWidget(spacer)

                # 文本区域
                text_widget = QWidget()
                text_layout = QVBoxLayout(text_widget)
                text_layout.setContentsMargins(0, 0, 0, 0)
                text_layout.setSpacing(2)

                title_label = QLabel(conv['title'] + current_mark)
                title_label.setStyleSheet("font-size: 14px; font-weight: bold; color: #1e293b; font-family: Arial, 'Microsoft YaHei';")
                text_layout.addWidget(title_label)

                info_label = QLabel(f"{msg_count} 条消息  ·  {conv['time']}")
                info_label.setStyleSheet("font-size: 12px; color: #94a3b8; font-family: Arial, 'Microsoft YaHei';")
                text_layout.addWidget(info_label)

                item_layout.addWidget(text_widget, 1)

                list_item = QListWidgetItem()
                list_item.setData(Qt.UserRole, conv['id'])
                item_widget.setMinimumHeight(48)
                list_item.setSizeHint(item_widget.minimumSizeHint())
                history_list.addItem(list_item)
                history_list.setItemWidget(list_item, item_widget)

        def delete_conv(conv_id):
            reply = QMessageBox.question(dialog, "确认删除",
                "确定删除该会话？不可恢复。", QMessageBox.Yes | QMessageBox.No)
            if reply == QMessageBox.Yes:
                self.conversations = [c for c in self.conversations if c['id'] != conv_id]
                self._save_conversations()
                populate_list()

        populate_list()
        layout.addWidget(history_list)

        def on_item_clicked(item):
            conv_id = item.data(Qt.UserRole)
            if conv_id == self.current_conv_id:
                dialog.close()
                return
            self._switch_to_conv(conv_id)
            dialog.close()

        history_list.itemDoubleClicked.connect(on_item_clicked)

        # 底部按钮
        btn_row = QHBoxLayout()
        open_btn = QPushButton("打开选中")
        open_btn.setStyleSheet("QPushButton { background: #1e9bd7; color: white; border: none; border-radius: 6px; padding: 6px 14px; font-size: 13px; } QPushButton:hover { background: #178ab8; }")
        open_btn.clicked.connect(lambda: on_item_clicked(history_list.currentItem()) if history_list.currentItem() else None)
        btn_row.addWidget(open_btn)

        btn_row.addStretch()
        close_btn = QPushButton("关闭")
        close_btn.setStyleSheet("QPushButton { background: #f1f5f9; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 14px; font-size: 13px; } QPushButton:hover { background: #e2e8f0; }")
        close_btn.clicked.connect(dialog.close)
        btn_row.addWidget(close_btn)
        layout.addLayout(btn_row)

        # 显示在聊天窗口中央
        dialog.move(
            self.chat_window.x() + (self.chat_window.width() - 300) // 2,
            self.chat_window.y() + (self.chat_window.height() - 400) // 2
        )
        dialog.show()

    def _switch_to_conv(self, conv_id):
        """切换到指定会话"""
        target = None
        for conv in self.conversations:
            if conv['id'] == conv_id:
                target = conv
                break
        if not target:
            return

        log.info(f"switching to conv {conv_id}: {target['title']}")
        self.current_conv_id = conv_id

        # 重建聊天界面
        self.chat_window.clear_messages()
        for msg in target['messages']:
            if msg['role'] == 'user':
                self.chat_window.add_message(msg['text'], is_user=True)
            else:
                display = self.format_markdown(msg['text'])
                self.chat_window.add_message(display, is_user=False)

        # TCP 模式：发送 reset 后注入历史消息到 session
        if self.tcp_worker and self.tcp_worker.isRunning() and target['messages']:
            self.tcp_worker.send_reset()
            # 使用 inject 命令直接注入历史消息（不调用 API）
            self.tcp_worker.send_inject(target['messages'])

    def on_attach(self):
        files, _ = QFileDialog.getOpenFileNames(self.chat_window, "选择文件", "", "All Files (*)")
        for f in files:
            if f:
                name = f.replace("\\", "/").split("/")[-1]
                self.chat_window.add_message(f"\U0001f4ce {name}", is_user=True)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    # 设置 Tooltip 样式（避免透明窗口导致黑色背景）
    from PySide6.QtGui import QPalette
    palette = app.palette()
    palette.setColor(QPalette.ToolTipBase, QColor("#ffffff"))
    palette.setColor(QPalette.ToolTipText, QColor("#1e293b"))
    app.setPalette(palette)
    app.setStyleSheet("QToolTip { background-color: #ffffff; color: #1e293b; border: 1px solid #d1d5db; border-radius: 4px; padding: 4px 8px; font-size: 12px; font-family: Arial, 'Microsoft YaHei'; opacity: 255; }")
    font = QFont("Arial", 10)
    font.setFamilies(["Arial", "Microsoft YaHei"])
    font.setStyleStrategy(QFont.PreferAntialias)
    app.setFont(font)
    frontier = FrontierApp()
    sys.exit(app.exec())
