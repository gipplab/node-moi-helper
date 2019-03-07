FROM mathwebsearch/latexml-mws:latest
ENTRYPOINT [ "hypnotoad", "-f", "script/ltxmojo" ]