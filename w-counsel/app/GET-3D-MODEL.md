# 给军师换上真 3D 模型 — 操作单 (Meshy / Tripo → .glb)

目标：拿到一个 `zhuge.glb` 放进 `public/models/zhuge/`，应用会**自动**把"四视图立板"升级成**真·体积 3D**（任意角度平滑、有光影）。无需改代码——放进去刷新即可。

---

## 你要用到的输入文件（已为你备好）

都在 `<your-folder>\junshi-app\public\models\zhuge\`：

- **`for3d_fullbody.png`** — 高清整身渲染图（**单图模式**用这张，工具会自动抠底）
- **`turn_front.png` / `turn_right.png` / `turn_back.png` / `turn_left.png`** — 四视图，已抠透明底（**多图模式**用这四张，效果更准）

---

## 方案 A — Meshy（推荐，免费额度够用）

1. 打开 **https://www.meshy.ai** → 注册/登录（Google 一键即可）。
2. 左侧选 **Image to 3D**。
3. **上传图片**：
   - 想最省事 → 传 **`for3d_fullbody.png`** 一张。
   - 想更准（推荐，你有四视图）→ 找 **Multi-Image / 多视图** 选项，按 **正/右/背/左** 分别传 `turn_front / turn_right / turn_back / turn_left`。
4. 设置：
   - **Art Style**：选 **Stylized / Cartoon**（别选 Realistic——他是体素卡通风）。
   - **Symmetry**：Auto。
   - **Texture**：开（带颜色贴图）。
   - **Topology / Polycount**：默认即可。
5. 点 **Generate**，等 1–3 分钟出预览。
6. 满意就点 **Refine / 高清化**（让贴图更清晰），再等一会。
7. 右上 **Download** → 选 **GLB** 格式下载。

## 方案 B — Tripo（备选，速度快）

1. **https://www.tripo3d.ai** → 登录。
2. **Image to 3D** → 传 `for3d_fullbody.png`（或多视图）。
3. Generate → 预览 → **Download → GLB**。

> 两家都行；哪家出的形更像你的 board 就用哪家。多视图通常比单图更还原。

---

## 放置（最后一步）

1. 把下载的文件**重命名为** `zhuge.glb`。
2. 放到：`<your-folder>\junshi-app\public\models\zhuge\zhuge.glb`
3. 浏览器刷新 **http://localhost:5174** —— 军师自动变成真 3D 身。

完成后跟我说一声 **"glb 放好了"**，我会：
- 检查朝向/缩放/着地是否正确（朝向偏了我会在代码里转正）；
- 把**说话动效**接到模型上（点头/挥羽扇），有骨骼的话接**口型**；
- 调好光影与构图。

---

## 不想自己弄？

把生成好的 `.glb`（或 `.obj/.fbx/.vox`）丢进那个文件夹、告诉我文件名，转换与接线我全包。
