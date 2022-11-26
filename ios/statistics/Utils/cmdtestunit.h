#ifndef CMDTESTUNIT_H
#define CMDTESTUNIT_H

#include <stdlib.h>

typedef void (*CmdTest)(void * handle);

typedef struct tagCmdTestUnit {
    const char *cmdTestDescription;
    CmdTest cmdTestFunction;
} CmdTestUnit;

extern CmdTestUnit listCmdTestUnit[];
extern size_t listCmdTestUnitSize;

#endif // CMDTESTUNIT_H
