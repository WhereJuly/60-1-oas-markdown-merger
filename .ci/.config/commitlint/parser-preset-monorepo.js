'use strict';

module.exports = {
    parserOpts: {
        headerPattern: /^\[([^\]]+)\]\s+(\w*!?)(?:\s+\(([^)]+)\))?(?:\s+\[(issue\s+#\d+)\])?:\s+(.+)$/,
        headerCorrespondence: ['package', 'type', 'scope', 'ticket', 'subject']
    }
};
