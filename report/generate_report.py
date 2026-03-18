#!/usr/bin/env python3
"""
生成 OpenClaw 报告的 HTML 和 PDF 版本
"""

import markdown
import os
from pathlib import Path

# 读取 Markdown 文件
md_file = Path('/Users/tina/Downloads/tinaproject/openclaw-report.md')
with open(md_file, 'r', encoding='utf-8') as f:
    md_content = f.read()

# 转换为 HTML
html_content = markdown.markdown(md_content, extensions=['tables', 'fenced_code'])

# 创建完整的 HTML 文档
html_template = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenClaw 生态系统商业分析报告</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            line-height: 1.8;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }}

        h1 {{
            font-size: 2.8em;
            color: #667eea;
            margin-bottom: 30px;
            text-align: center;
            font-weight: 700;
            letter-spacing: -1px;
        }}

        h2 {{
            font-size: 2em;
            color: #764ba2;
            margin-top: 50px;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 3px solid #667eea;
            font-weight: 600;
        }}

        h3 {{
            font-size: 1.5em;
            color: #555;
            margin-top: 35px;
            margin-bottom: 20px;
            font-weight: 600;
        }}

        blockquote {{
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-left: 5px solid #667eea;
            padding: 20px 30px;
            margin: 30px 0;
            border-radius: 10px;
            font-size: 1.05em;
            color: #555;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            border-radius: 10px;
            overflow: hidden;
        }}

        th {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 18px;
            text-align: left;
            font-weight: 600;
            font-size: 1.05em;
        }}

        td {{
            padding: 15px 18px;
            border-bottom: 1px solid #e0e0e0;
        }}

        tr:hover {{
            background-color: #f8f9fa;
        }}

        tr:last-child td {{
            border-bottom: none;
        }}

        code {{
            background: #f4f4f4;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: "Monaco", "Menlo", monospace;
            font-size: 0.9em;
            color: #e83e8c;
        }}

        pre {{
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 25px;
            border-radius: 10px;
            overflow-x: auto;
            margin: 25px 0;
            line-height: 1.6;
            font-family: "Monaco", "Menlo", monospace;
        }}

        pre code {{
            background: none;
            color: inherit;
            padding: 0;
        }}

        ul, ol {{
            margin: 20px 0 20px 40px;
        }}

        li {{
            margin: 10px 0;
        }}

        strong {{
            color: #667eea;
            font-weight: 600;
        }}

        hr {{
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
            margin: 50px 0;
        }}

        a {{
            color: #667eea;
            text-decoration: none;
            border-bottom: 2px solid transparent;
            transition: border-color 0.3s;
        }}

        a:hover {{
            border-bottom-color: #667eea;
        }}

        .footer {{
            text-align: center;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
            color: #888;
            font-size: 0.95em;
        }}

        @media print {{
            body {{
                background: white;
                padding: 0;
            }}
            .container {{
                box-shadow: none;
                padding: 40px;
            }}
        }}

        @media (max-width: 768px) {{
            .container {{
                padding: 30px 20px;
            }}
            h1 {{
                font-size: 2em;
            }}
            h2 {{
                font-size: 1.6em;
            }}
            table {{
                font-size: 0.9em;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        {html_content}
        <div class="footer">
            <p>© 2026 OpenClaw 生态系统商业分析报告 | 数据来源：TrustMRR</p>
        </div>
    </div>
</body>
</html>
"""

# 保存 HTML 文件
html_file = Path('/Users/tina/Downloads/tinaproject/openclaw-report.html')
with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html_template)

print(f"✅ HTML 文件已生成: {html_file}")

# 尝试生成 PDF（需要 weasyprint 或 pdfkit）
try:
    from weasyprint import HTML
    pdf_file = Path('/Users/tina/Downloads/tinaproject/openclaw-report.pdf')
    HTML(string=html_template).write_pdf(pdf_file)
    print(f"✅ PDF 文件已生成: {pdf_file}")
except ImportError:
    print("⚠️  weasyprint 未安装，尝试使用 pdfkit...")
    try:
        import pdfkit
        pdf_file = Path('/Users/tina/Downloads/tinaproject/openclaw-report.pdf')
        pdfkit.from_string(html_template, str(pdf_file))
        print(f"✅ PDF 文件已生成: {pdf_file}")
    except ImportError:
        print("❌ PDF 生成失败：需要安装 weasyprint 或 pdfkit")
        print("   安装命令: pip3 install weasyprint")
