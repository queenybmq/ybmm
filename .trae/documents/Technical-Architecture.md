# 扫雷游戏 - 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────┐
│              UI 层                       │
│  ┌─────────────────────────────────┐    │
│  │  Header (雷数/计时/重开)         │    │
│  ├─────────────────────────────────┤    │
│  │  Game Grid (游戏网格)            │    │
│  │  - Cell Component (方块组件)     │    │
│  ├─────────────────────────────────┤    │
│  │  Difficulty Selector (难度选择)  │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│            游戏状态层                     │
│  - gameState (进行中/胜利/失败)          │
│  - grid[][] (网格数据)                   │
│  - minesRemaining (剩余雷数)             │
│  - timer (计时器)                        │
├─────────────────────────────────────────┤
│            逻辑层                        │
│  - generateMines() 生成雷区              │
│  - calculateNumbers() 计算数字           │
│  - revealCell() 展开方块                 │
│  - toggleFlag() 切换旗帜                 │
│  - autoReveal() 自动展开                 │
│  - checkWin() 检查胜利                    │
└─────────────────────────────────────────┘
```

## 2. 技术栈

- **HTML5**: 语义化结构
- **CSS3**: 变量系统、Flexbox布局、box-shadow 3D效果、@keyframes 动画
- **JavaScript (ES6+)**: 原生实现，无框架依赖

## 3. 数据结构

### 3.1 方块对象
```javascript
{
  isMine: boolean,      // 是否为地雷
  isRevealed: boolean,  // 是否已揭开
  isFlagged: boolean,   // 是否插旗
  adjacentMines: number // 周围雷数 (0-8)
}
```

### 3.2 游戏配置
```javascript
const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};
```

## 4. 核心算法实现

### 4.1 无猜雷区生成
```javascript
function generateMines(firstClickRow, firstClickCol) {
  // 在首次点击周围 3×3 区域外随机放置地雷
  // 确保首次点击安全
}
```

### 4.2 自动展开逻辑
```javascript
function autoReveal(row, col) {
  // 检查周围旗帜数是否等于数字
  // 如果匹配，展开所有未标记的相邻方块
}
```

## 5. 事件处理

| 事件 | 操作 |
|------|------|
| 左键点击 | 揭开方块 / 触发自动展开 |
| 右键点击 | 切换旗帜状态 |
| 长按 (移动端) | 切换旗帜状态 |
| 重开按钮 | 重新初始化游戏 |

## 6. 响应式策略

- **桌面端**: 固定方块尺寸 36px，鼠标悬停效果
- **平板端**: 方块尺寸 32px，触摸优化
- **移动端**: 方块尺寸根据屏幕宽度计算，保证完整显示
