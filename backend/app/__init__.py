# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated
"""powr backend application.

Package layout:
    main.py       Application entry point; uvicorn serves ``app.main:app``.
    core/         Infrastructure shared by every module: settings, database session, logging.
    api/          Top-level router and app-wide endpoints such as ``GET /health``.
    modules/      Business features, one sub-package per domain area (``pos``, ``forecasting``).

Each module owns its ``router``, ``service``, ``repository``, ``models`` and ``schemas``.
Dependencies flow router -> service -> repository. Modules call each other only through
their service layer, never through another module's repository or models.
"""
