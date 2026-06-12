import sys
import os
from pathlib import Path
from PySide2.QtWidgets import (
    QApplication, QWidget, QHBoxLayout, QVBoxLayout,
    QListWidget, QLabel, QPushButton, QFileDialog, QListWidgetItem
)
from PySide2.QtGui import QPixmap, QImage, QPainter, QPen, QColor
from PySide2.QtCore import Qt, QSize
from PySide2.QtWidgets import QGraphicsView, QGraphicsScene, QGraphicsPixmapItem


class ImagePreviewLabel(QLabel):
    """支持缩放的图片预览标签，自动适应窗口大小"""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setAlignment(Qt.AlignCenter)
        self.setStyleSheet("background-color: #2b2b2b;")
        self.setText("选择左侧图片预览")
        self.setMinimumSize(400, 300)

    def setImage(self, path):
        if not path or not os.path.exists(path):
            self.clear()
            self.setText("图片不存在")
            return

        pixmap = QPixmap(path)
        if pixmap.isNull():
            self.clear()
            self.setText("无法加载图片")
            return

        # 缩放图片以适应标签大小
        scaled = pixmap.scaled(
            self.size(),
            Qt.KeepAspectRatio,
            Qt.SmoothTransformation
        )
        self.setPixmap(scaled)


class ImageListWidget(QListWidget):
    """图片路径列表，支持拖拽目录"""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setAcceptDrops(True)

    def dragEnterEvent(self, event):
        if event.mimeData().hasUrls:
            event.acceptProposedAction()

    def dropEvent(self, event):
        for url in event.mimeData().urls():
            path = url.toLocalFile()
            if os.path.isdir(path):
                self.addImagesFromDir(path)
            elif self._isImage(path):
                self.addImage(path)

    def _isImage(self, path):
        ext = Path(path).suffix.lower()
        return ext in {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp", ".tiff"}

    def addImage(self, path):
        path = str(Path(path).resolve())
        # 避免重复添加
        for i in range(self.count()):
            if self.item(i).data(Qt.UserRole) == path:
                return
        item = QListWidgetItem(os.path.basename(path))
        item.setData(Qt.UserRole, path)
        self.addItem(item)

    def addImagesFromDir(self, directory):
        extensions = {".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp", ".tiff"}
        for root, _, files in os.walk(directory):
            for f in sorted(files):
                if Path(f).suffix.lower() in extensions:
                    self.addImage(os.path.join(root, f))


class MainWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("图片浏览器")
        self.resize(1000, 600)
        self._setup_ui()
        self._connect_signals()

    def _setup_ui(self):
        main_layout = QHBoxLayout(self)

        # 左侧：列表 + 按钮
        left_widget = QWidget()
        left_layout = QVBoxLayout(left_widget)

        self.list_widget = ImageListWidget()
        btn_layout = QHBoxLayout()
        self.open_btn = QPushButton("打开文件夹")
        self.clear_btn = QPushButton("清空列表")
        btn_layout.addWidget(self.open_btn)
        btn_layout.addWidget(self.clear_btn)

        left_layout.addWidget(self.list_widget)
        left_layout.addLayout(btn_layout)

        # 右侧：图片预览
        self.preview_label = ImagePreviewLabel()

        # 设置比例：左侧 1/3，右侧 2/3
        main_layout.addWidget(left_widget, 1)
        main_layout.addWidget(self.preview_label, 2)

    def _connect_signals(self):
        self.list_widget.itemClicked.connect(self._on_item_clicked)
        self.open_btn.clicked.connect(self._open_folder)
        self.clear_btn.clicked.connect(self.list_widget.clear)

    def _on_item_clicked(self, item):
        path = item.data(Qt.UserRole)
        self.preview_label.setImage(path)

    def _open_folder(self):
        folder = QFileDialog.getExistingDirectory(self, "选择图片文件夹")
        if folder:
            self.list_widget.addImagesFromDir(folder)
            if self.list_widget.count() > 0:
                self.list_widget.setCurrentRow(0)
                self._on_item_clicked(self.list_widget.item(0))

    def resizeEvent(self, event):
        # 当窗口大小改变时，重新缩放当前图片
        super().resizeEvent(event)
        current_items = self.list_widget.selectedItems()
        if current_items:
            self._on_item_clicked(current_items[0])


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())