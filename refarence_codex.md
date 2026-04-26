# References and Appendix Material for Report

This file is prepared so the content can be added at the end of the report under both the **References** section and the **Appendix** section. It documents the online materials, open-source libraries, APIs, and pretrained AI models used or referenced during development of the TruthLens project.

## References

1. Qr1meitCRZU. "YouTube video referenced in similarity review." YouTube.  
   URL: https://www.youtube.com/watch?v=Qr1meitCRZU

2. AI TruthLens. "AI TruthLens website."  
   URL: https://www.aitruthlens.org

3. TruthLens. "TruthLens website."  
   URL: https://truthlens.us

4. Use TruthLens. "Use TruthLens website."  
   URL: https://usetruthlens.com

5. Scribd. "2503-15867v3."  
   URL: https://www.scribd.com/document/982016794/2503-15867v3

6. botirk38. "fact-checker." GitHub repository.  
   URL: https://github.com/botirk38/fact-checker

7. ResearchGate. "TruthLens: AI-Powered Fake News and Misinformation Detection Using Multimodal Analysis."  
   URL: https://www.researchgate.net/publication/392780418_TruthLens_AI-Powered_Fake_News_and_Misinformation_Detection_Using_Multimodal_Analysis

8. Next.js Documentation.  
   URL: https://nextjs.org/docs

9. React Documentation.  
   URL: https://react.dev

10. Tailwind CSS Documentation.  
    URL: https://tailwindcss.com/docs

11. Prisma Documentation.  
    URL: https://www.prisma.io/docs

12. PostgreSQL Documentation.  
    URL: https://www.postgresql.org/docs/

13. FastAPI Documentation.  
    URL: https://fastapi.tiangolo.com/

14. Uvicorn Documentation.  
    URL: https://www.uvicorn.org/

15. Hugging Face Transformers Documentation.  
    URL: https://huggingface.co/docs/transformers/index

16. PyTorch Documentation.  
    URL: https://pytorch.org/docs/stable/index.html

17. JOSE for JavaScript (`jose`) documentation.  
    URL: https://github.com/panva/jose

18. `bcryptjs` package repository.  
    URL: https://github.com/dcodeIO/bcrypt.js

19. Serper API.  
    URL: https://serper.dev/

20. Google News RSS.  
    URL: https://news.google.com/rss

21. Gemini API model documentation.  
    URL: https://ai.google.dev/gemini-api/docs/models

## AI Models and External AI Services Used in This Project

The current repository implements the following AI-related models and services:

1. `facebook/bart-large-mnli`  
   Purpose in project: zero-shot fake news / claim classification.  
   URL: https://huggingface.co/facebook/bart-large-mnli

2. `distilbert-base-uncased-finetuned-sst-2-english`  
   Purpose in project: sentiment analysis.  
   URL: https://huggingface.co/distilbert/distilbert-base-uncased-finetuned-sst-2-english

3. `facebook/bart-large-cnn`  
   Purpose in project: text summarization.  
   URL: https://huggingface.co/facebook/bart-large-cnn

4. `dslim/bert-base-NER`  
   Purpose in project: entity extraction and claim extraction support.  
   URL: https://huggingface.co/dslim/bert-base-NER

5. `Gemini 2.0 Flash`  
   Purpose in project: chatbot responses and claim reasoning when API access is enabled.  
   URL: https://ai.google.dev/gemini-api/docs/models

6. Rule-based source credibility engine  
   Purpose in project: domain credibility scoring through project-defined heuristics and trusted/questionable source mapping.  
   URL: Internal project logic, no external model URL.

## Open-Source and Third-Party Components Implemented

The following major open-source or third-party technologies are implemented in the current project codebase:

- `Next.js 16` for the main web application and API routes.
- `React 19` for frontend UI development.
- `Tailwind CSS 4` for styling.
- `Prisma ORM` for database schema, migrations, and data access.
- `PostgreSQL` as the configured database provider in the current Prisma schema.
- `FastAPI` for the AI microservice.
- `Uvicorn` as the ASGI server for the AI service.
- `Transformers` for local NLP model loading and inference.
- `PyTorch` for model execution.
- `Pydantic` for Python data validation.
- `httpx` for outbound HTTP calls from the AI service.
- `jose` for JWT-based authentication and verification.
- `bcryptjs` for password hashing.
- `Serper API` for web search cross-referencing.
- `Google News RSS` as a fallback evidence source.
- `Google Gemini API` as an optional cloud AI service.

## Suggested References Section for the Final Report

The following paragraph can be added near the end of the report under **References**:

> This project was developed with the help of official documentation, open-source libraries, pretrained Hugging Face models, and public online resources related to misinformation detection and fact-checking systems. Related platforms and materials reviewed during development or similarity checking include the YouTube video `Qr1meitCRZU`, `aitruthlens.org`, `truthlens.us`, `usetruthlens.com`, the Scribd document `2503-15867v3`, the GitHub repository `botirk38/fact-checker`, and the ResearchGate publication *TruthLens: AI-Powered Fake News and Misinformation Detection Using Multimodal Analysis*. Core implemented technologies include Next.js, React, Tailwind CSS, Prisma, PostgreSQL, FastAPI, Uvicorn, Hugging Face Transformers, PyTorch, Serper API, Google News RSS, and Google Gemini API.

## Suggested Appendix Section for the Final Report

The following appendix text can be added under **Appendix: Use of Online Sources, Open Source, and AI Models**:

### Appendix A: Declaration of Online Sources and Open-Source Use

This project is an academic implementation developed for learning and demonstration purposes. During development, official documentation, open-source packages, pretrained AI models, and public online materials were consulted. The project domain is AI-based misinformation detection, so some conceptual similarity with existing online TruthLens-named websites, fact-checking repositories, and academic papers is expected. Those materials were used as background references, learning resources, or comparison points, not as a direct one-to-one reproduction of a single existing product.

The implemented system in this repository combines a `Next.js` frontend, `React` user interface, `Prisma` ORM, `PostgreSQL` database configuration, and a `FastAPI` AI microservice. For AI and NLP functionality, the project uses pretrained Hugging Face models including `facebook/bart-large-mnli`, `distilbert-base-uncased-finetuned-sst-2-english`, `facebook/bart-large-cnn`, and `dslim/bert-base-NER`. The project also uses `Gemini 2.0 Flash` through the Gemini API for optional chatbot and reasoning features, `Serper API` for search-based evidence collection, and `Google News RSS` as a fallback source retrieval mechanism.

The project therefore includes both original integration work and reused open-source/public resources. All such external items should be acknowledged in the report for academic transparency.

### Appendix B: Repository-Based Evidence of External Technology Use

The current repository shows the following implemented external components:

- `package.json`: Next.js, React, Prisma, jose, bcryptjs, Tailwind CSS.
- `ai-service/requirements.txt`: FastAPI, Uvicorn, Transformers, PyTorch, Pydantic, python-dotenv, httpx.
- `src/lib/verify.ts`: Serper API, Google News RSS fallback, Gemini API integration.
- `ai-service/models/fake_news.py`: `facebook/bart-large-mnli`.
- `ai-service/models/sentiment.py`: `distilbert-base-uncased-finetuned-sst-2-english`.
- `ai-service/models/summarizer.py`: `facebook/bart-large-cnn`.
- `ai-service/models/claim_extractor.py`: `dslim/bert-base-NER`.
- `prisma/schema.prisma`: PostgreSQL datasource and project database models.

## Short Submission Note

If a short statement is needed to answer the teacher directly, this can be used:

> This project uses open-source libraries, pretrained Hugging Face models, public APIs, and online technical documentation. Similarity may exist because the problem domain, project name, and model choices overlap with existing fact-checking platforms and tutorials. These sources are now formally acknowledged in the References and Appendix sections for academic transparency.
