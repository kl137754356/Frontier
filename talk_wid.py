import sys
from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *

# --------------------------
# 悬浮球
# --------------------------
class FloatBall(QWidget):
    def __init__(self):
        super().__init__()
        self.setFixedSize(58, 58)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setStyleSheet("""
            QWidget {
                background-color: #6366f1;
                border-radius: 29px;
            }
        """)

        self.dragging = False
        self.move(1000, 600)

    def mousePressEvent(self, e):
        if e.button() == Qt.LeftButton:
            self.drag_start = e.globalPosition().toPoint()
            self.window_pos = self.pos()
            self.dragging = True

    def mouseMoveEvent(self, e):
        if self.dragging:
            delta = e.globalPosition().toPoint() - self.drag_start
            self.move(self.window_pos + delta)

    def mouseReleaseEvent(self, e):
        self.dragging = False

# --------------------------
# 消息气泡（用户 / AI）
# --------------------------
class MessageBubble(QWidget):
    def __init__(self, text, is_user=False):
        super().__init__()
        layout = QHBoxLayout(self)
        layout.setContentsMargins(10,10,10,10)

        label = QLabel(text)
        label.setWordWrap(True)
        label.setStyleSheet("font-size:14px; line-height:1.4;")

        if is_user:
            label.setStyleSheet("color:white; font-size:14px;")
            bubble_style = """
                background-color: #6366f1;
                border-radius:14px;
                border-top-right-radius:4px;
                padding:10px 14px;
            """
            layout.setAlignment(Qt.AlignRight)
        else:
            bubble_style = """
                background-color:white;
                border:1px solid #e5e7eb;
                border-radius:14px;
                border-top-left-radius:4px;
                padding:10px 14px;
            """
            layout.setAlignment(Qt.AlignLeft)

        label.setStyleSheet(label.styleSheet() + bubble_style)
        layout.addWidget(label)

# --------------------------
# 聊天窗口
# --------------------------
class ChatWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setFixedSize(420, 680)
        self.setWindowTitle("Polaris 助手")
        self.setWindowFlags(Qt.Window | Qt.WindowTitleHint | Qt.WindowCloseButtonHint)
        self.setStyleSheet("background-color:white; border-radius:18px;")

        # 主布局
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(0,0,0,0)
        main_layout.setSpacing(0)

        # 顶部标题
        header = QLabel(" Polaris 助手")
        header.setFixedHeight(52)
        header.setStyleSheet("background-color:#6366f1; color:white; font-size:16px; padding-left:16px;")
        main_layout.addWidget(header)

        # 聊天内容区
        self.chat_area = QWidget()
        self.chat_layout = QVBoxLayout(self.chat_area)
        self.chat_layout.addStretch()

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setWidget(self.chat_area)
        scroll.setStyleSheet("background-color:#f9fafb; border:none;")
        main_layout.addWidget(scroll)

        # 底部输入区域
        self.build_input_area(main_layout)

        # 初始消息
        self.add_message("你好！我是Hexagon助手，你可以问我各种问题～", is_user=False)

    def build_input_area(self, parent_layout):
        input_widget = QWidget()
        input_widget.setStyleSheet("border-top:1px solid #eee;")
        layout = QVBoxLayout(input_widget)

        self.text_input = QTextEdit()
        self.text_input.setPlaceholderText("请输入问题...")
        self.text_input.setMaximumHeight(180)
        layout.addWidget(self.text_input)

        # 工具栏
        bar = QWidget()
        bar_layout = QHBoxLayout(bar)

        btn_shot = QPushButton("📷")
        btn_attach = QPushButton("📎")
        btn_new = QPushButton("➕")
        btn_history = QPushButton("🕘")
        btn_send = QPushButton("发送")

        btn_send.setStyleSheet("background-color:#6366f1; color:white; padding:6px 16px; border-radius:14px;")

        bar_layout.addWidget(btn_shot)
        bar_layout.addWidget(btn_attach)
        bar_layout.addStretch()
        bar_layout.addWidget(btn_new)
        bar_layout.addWidget(btn_history)
        bar_layout.addWidget(btn_send)

        layout.addWidget(bar)
        parent_layout.addWidget(input_widget)

        btn_send.clicked.connect(self.send_msg)

    def add_message(self, text, is_user):
        bubble = MessageBubble(text, is_user)
        self.chat_layout.insertWidget(self.chat_layout.count()-1, bubble)
        QTimer.singleShot(10, self.scroll_to_bottom)

    def scroll_to_bottom(self):
        area = self.findChild(QScrollArea)
        area.verticalScrollBar().setValue(area.verticalScrollBar().maximum())

    def send_msg(self):
        text = self.text_input.toPlainText().strip()
        if not text: return
        self.add_message(text, is_user=True)
        self.text_input.clear()
        QTimer.singleShot(500, lambda: self.add_message("我已收到你的消息！", False))

# --------------------------
# 主程序
# --------------------------
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.float_ball = FloatBall()
        self.chat_window = ChatWindow()

        self.float_ball.show()
        self.float_ball.mouseReleaseEvent = self.on_ball_click

    def on_ball_click(self, e):
        if e.button() == Qt.LeftButton:
            if self.chat_window.isVisible():
                self.chat_window.hide()
            else:
                self.chat_window.show()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    sys.exit(app.exec())