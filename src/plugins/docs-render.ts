import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { marked } from "marked";
import fs from "fs/promises";
import path from "path";

async function docsPlugin(fastify: FastifyInstance) {
  const docsPath = path.join(process.cwd(), "docs");

  // Beautiful HTML template with modern styling
  const template = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #0066cc;
            --secondary-color: #f8fafc;
            --accent-color: #0052a3;
            --text-color: #1a202c;
            --border-color: #e2e8f0;
            --code-bg: #1e293b;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --error-color: #ef4444;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .docs-header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .docs-header h1 {
            color: white;
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .docs-header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.1rem;
            margin: 0.5rem 0 0 0;
        }

        .markdown-body {
            background: white;
            border-radius: 20px;
            padding: 3rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--border-color);
            font-family: 'Inter', sans-serif;
            color: var(--text-color);
        }

        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
            color: var(--primary-color);
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }

        .markdown-body h1 {
            font-size: 2.25rem;
            border-bottom: 3px solid var(--primary-color);
            padding-bottom: 0.5rem;
        }

        .markdown-body h2 {
            font-size: 1.75rem;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 0.3rem;
        }

        .markdown-body h3 {
            font-size: 1.5rem;
            color: var(--accent-color);
        }

        .markdown-body code {
            font-family: 'JetBrains Mono', 'Monaco', 'Menlo', monospace;
            background: var(--secondary-color);
            padding: 0.2rem 0.4rem;
            border-radius: 6px;
            font-size: 0.9em;
            border: 1px solid var(--border-color);
        }

        .markdown-body pre {
            background: var(--code-bg) !important;
            border-radius: 12px;
            padding: 1.5rem;
            overflow-x: auto;
            border: 1px solid #374151;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .markdown-body pre code {
            background: transparent;
            border: none;
            padding: 0;
            color: #e5e7eb;
            font-family: 'JetBrains Mono', monospace;
        }

        .markdown-body blockquote {
            border-left: 4px solid var(--primary-color);
            background: var(--secondary-color);
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0 8px 8px 0;
        }

        .markdown-body table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5rem 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        .markdown-body th {
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }

        .markdown-body td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border-color);
        }

        .markdown-body tr:hover {
            background: var(--secondary-color);
        }

        .markdown-body ul, .markdown-body ol {
            padding-left: 2rem;
        }

        .markdown-body li {
            margin: 0.5rem 0;
        }

        .markdown-body strong {
            color: var(--accent-color);
            font-weight: 600;
        }

        .markdown-body a {
            color: var(--primary-color);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
        }

        .markdown-body a:hover {
            border-bottom-color: var(--primary-color);
        }

        .method-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-right: 0.5rem;
        }

        .method-get { background: var(--success-color); color: white; }
        .method-post { background: var(--primary-color); color: white; }
        .method-patch { background: var(--warning-color); color: white; }
        .method-delete { background: var(--error-color); color: white; }

        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
        }

        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        .scroll-to-top:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .markdown-body {
                padding: 1.5rem;
                border-radius: 12px;
            }
            
            .docs-header h1 {
                font-size: 2rem;
            }
            
            .markdown-body h1 {
                font-size: 1.8rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="docs-header">
            <h1>🛠️ API Documentation</h1>
            <p>Comprehensive guide to our API endpoints</p>
        </div>
        <div class="markdown-body">${content}</div>
    </div>
    
    <button class="scroll-to-top" onclick="scrollToTop()">↑</button>

    <script>
        // Initialize highlight.js
        hljs.highlightAll();
        
        // Scroll to top functionality
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            const scrollBtn = document.querySelector('.scroll-to-top');
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Add method badges to headers
        document.addEventListener('DOMContentLoaded', () => {
            const headers = document.querySelectorAll('h3');
            headers.forEach(header => {
                const text = header.textContent;
                if (text.includes('GET')) {
                    header.innerHTML = header.innerHTML.replace('GET', '<span class="method-badge method-get">GET</span>');
                } else if (text.includes('POST')) {
                    header.innerHTML = header.innerHTML.replace('POST', '<span class="method-badge method-post">POST</span>');
                } else if (text.includes('PATCH')) {
                    header.innerHTML = header.innerHTML.replace('PATCH', '<span class="method-badge method-patch">PATCH</span>');
                } else if (text.includes('DELETE')) {
                    header.innerHTML = header.innerHTML.replace('DELETE', '<span class="method-badge method-delete">DELETE</span>');
                }
            });
        });
    </script>
</body>
</html>`;

  // Route for any .md file
  fastify.get("/docs/:file", async (request, reply) => {
    const { file } = request.params as { file: string };

    if (!file.endsWith(".md")) {
      return reply.code(404).send("Not found");
    }

    try {
      const content = await fs.readFile(path.join(docsPath, file), "utf-8");
      const html = template(await marked(content));
      return reply.type("text/html").send(html);
    } catch (error) {
      return reply.code(404).send("File not found");
    }
  });
}

export default fp(docsPlugin);
