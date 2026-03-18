#!/usr/bin/env python3
"""
translate_cases.py
批量从 GitHub 拉取所有 OpenClaw 案例的 markdown 内容，翻译为中文，
保存到 data/translations/{id}.json
"""

import json
import os
import time
import urllib.request
from pathlib import Path
import anthropic

BASE_URL = "https://raw.githubusercontent.com/hesamsheikh/awesome-openclaw-usecases/main/usecases"
OUT_DIR = Path(__file__).parent.parent / "data" / "translations"
CASES_JSON = Path(__file__).parent.parent / "data" / "cases.json"

client = anthropic.Anthropic(
    api_key=os.environ["ANTHROPIC_AUTH_TOKEN"],
    base_url=os.environ.get("ANTHROPIC_BASE_URL", "https://api.anthropic.com"),
)


def fetch_markdown(case_id: str, github_file: str | None = None) -> str | None:
    filename = github_file or case_id
    url = f"{BASE_URL}/{filename}.md"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            return resp.read().decode("utf-8")
    except Exception as e:
        print(f"  ⚠ 拉取失败 {case_id}: {e}")
        return None


def translate_markdown(case_id: str, name_zh: str, md: str) -> str:
    """
    翻译 markdown 内容为中文，保留 markdown 结构（标题、列表、代码块）
    """
    prompt = f"""你是一名技术翻译专家。请将下面这篇 OpenClaw 应用案例的 Markdown 文档翻译成简体中文。

翻译要求：
1. 保留所有 Markdown 格式（# 标题、- 列表、```代码块```、> 引用、**粗体**、`行内代码`、[链接](url)）
2. 代码块内的代码不要翻译，只翻译代码块的语言标签（如 \`\`\`text 改为 \`\`\`提示词 ）
3. 专有名词保留英文，如 OpenClaw、Reddit、subreddit、API、prompt 等
4. 翻译流畅自然，符合中文技术文档习惯
5. 第一个 # 标题翻译为「{name_zh}」
6. 直接输出翻译后的 Markdown，不要添加任何说明

原文：
{md}"""

    msg = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(CASES_JSON) as f:
        cases = json.load(f)

    total = len(cases)
    success = 0
    skip = 0

    for i, case in enumerate(cases, 1):
        case_id = case["id"]
        name_zh = case.get("nameZh", case["name"])
        out_file = OUT_DIR / f"{case_id}.json"

        # 跳过已翻译的
        if out_file.exists():
            print(f"[{i}/{total}] 跳过（已存在）: {case_id}")
            skip += 1
            continue

        print(f"[{i}/{total}] 翻译中: {case_id} ({name_zh})")

        github_file = case.get("githubFile")
        md = fetch_markdown(case_id, github_file)
        if not md:
            print(f"  ✗ 跳过（无法获取内容）")
            continue

        try:
            zh_md = translate_markdown(case_id, name_zh, md)
            with open(out_file, "w", encoding="utf-8") as f:
                json.dump({"id": case_id, "content": zh_md}, f, ensure_ascii=False, indent=2)
            print(f"  ✓ 完成 ({len(zh_md)} 字符)")
            success += 1
        except Exception as e:
            print(f"  ✗ 翻译失败: {e}")

        # 避免速率限制
        if i < total:
            time.sleep(0.5)

    print(f"\n完成: {success} 个翻译成功, {skip} 个跳过, {total - success - skip} 个失败")


if __name__ == "__main__":
    main()
