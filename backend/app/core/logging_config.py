# Copyright 2026 POWR Contributors
# AI contribution: 50% or more AI-generated
"""Central logging setup. Modules log through ``logging.getLogger(__name__)``."""

import logging

LOG_FORMAT = "%(asctime)s %(levelname)s [%(name)s] %(message)s"


def configure_logging(level: str) -> None:
    # basicConfig is a no-op when handlers already exist (e.g. pytest's log capture),
    # so the level is applied separately to always take effect.
    logging.basicConfig(format=LOG_FORMAT)
    logging.getLogger().setLevel(level)
