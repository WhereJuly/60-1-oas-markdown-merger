'use strict';

module.exports = {
    parserOpts: {
        headerPattern: /^\[([^\]]+)\]\s+(\w*!?)(?:\s+\(([^)]+)\))?(?:\s+\[(issue\s+#\d+)\])?:\s+(.+)$/,
        headerCorrespondence: ['packages', 'type', 'scope', 'ticket', 'subject']
    }
};
