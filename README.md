# Connected Self Forcing

Static paper homepage: main video, overview with a collapsed full paper abstract and a simplified training mechanism comparison, a compact collapsed Method details entry below the overview, and full prompt-by-prompt video comparisons. Keep `index.html` and `static/` together at the root of the standalone `EastbeanZhang/CSF` repository.

## Replace the main video

Replace `static/videos/main.mp4` with the new main demonstration. Use an MP4 with H.264 video and, if present, AAC audio. Replace `static/images/poster.jpg` to update its cover. The page does not hard-code the main video's runtime. The current compressed copy preserves 1920 × 1080, 16 fps, all 134 seconds, and the original AAC audio track. A small footer note explains that videos have been compressed to reduce file sizes.

## Full comparisons

`static/videos/prompt-01/` through `prompt-09/` each contain `sf.mp4`, `sgf.mp4`, and `csf.mp4`. These are full-length compressed web copies. They use H.264 video, with every original frame and the original 832 × 480 dimensions retained. No frames are cut or interpolated. Most copies were exported with HandBrake; the tea-cup SGF copy was encoded from its original with two-pass x264 to preserve the full frame. All MP4 files are optimized for progressive web playback. The unchanged originals are kept outside the publishing folder in `video_demo/CSF_Comparison_Originals/`; the main video original is also retained in `video_demo/CSF_HandBrake_Source/`. Posters are in `static/images/`. Each comparison shows the full original generation prompt above its videos, without shortening or rewriting it.

Playback buttons and the shared timeline synchronize the three methods. Starting a comparison pauses other comparisons. Each video retains native controls, including fullscreen; its playback and seeking controls also synchronize the group. On phones, the three videos stack vertically.

## Edit the page

- `index.html`: title, overview, prompts, and section content.
- `static/css/style.css`: responsive layout and typography.
- `static/js/main.js`: synchronized comparison controls.
- `static/images/pipeline.webp`: method pipeline.
- `static/paper/connected-self-forcing.pdf`: paper PDF.

The arXiv, Code, and YouTube buttons are placeholders without destinations. Add their `href` values and remove `aria-disabled` once the URLs are ready. Author names and affiliations are listed in the header; publication details can be added once finalized. Every current file is below GitHub's 100 MB per-file limit; the full comparison collection remains relatively large even after web compression.

## Preview

Run `python3 -m http.server 8765` from this directory, then open `http://localhost:8765/`. No build or external font, stylesheet, or JavaScript dependency is required.

## Author links

Profile preference is personal homepage, then Google Scholar, then GitHub. Verified profiles open in a new tab. Authors whose profiles could not be reliably matched remain plain text. The four Scholar URLs below were cross-checked against the same authors on the [VGGT-Diff project page](https://chenkangjie1123.github.io/VGGT-Diff/); automated requests to Scholar may be restricted by Google.

| Author | Profile |
| --- | --- |
| Dongbin Zhang | [Homepage](https://eastbeanzhang.github.io/) |
| Chaoda Zheng | [Homepage](https://ghostish.github.io/) |
| Kangjie Chen | [GitHub](https://github.com/chenkangjie1123) |
| Jinhao Deng | [Google Scholar](https://scholar.google.com/citations?user=4lD_AkgAAAAJ&hl=en) |
| Guangfeng Jiang | [Homepage](https://jiangxb98.github.io/) |
| Hongbin Lin | [Google Scholar](https://scholar.google.com/citations?user=LqX1k5QAAAAJ&hl=en) |
| Choo Sin Wai | [Google Scholar](https://scholar.google.com/citations?user=XM2n3scAAAAJ&hl=en) |
| Puyi Wang | [Homepage](https://wangpuyi.github.io/) |
| Xianming Liu | [Google Scholar](https://scholar.google.com/citations?user=697UEEIAAAAJ&hl=en) |

Guangfeng Jiang’s homepage was confirmed through his [Scholar profile](https://scholar.google.com/citations?user=-ocVCHgAAAAJ&hl=zh-CN), which links to the same XPENG research profile.

## Deployment

Publish the standalone `CSF` repository with GitHub Pages, using the `main` branch and the root folder. The `.nojekyll` file keeps this site static. Its project URL is `https://eastbeanzhang.github.io/CSF/`. Upload only this repository; keep original video backups and working material outside it.
