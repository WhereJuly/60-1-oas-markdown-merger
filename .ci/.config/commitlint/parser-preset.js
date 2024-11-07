'use strict';

module.exports = {
    parserOpts: {
        headerPattern: /^(\w*!?)\s?(\(.+\))?\s?(\[.*\])*: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'ticket', 'subject']
    }
};

// const presets = {
//     multirepo: {
//         headerPattern: /^(\w*!?)\s?(\(.+\))?\s?(\[.*\])*: (.*)$/,
//         headerCorrespondence: ['type', 'scope', 'ticket', 'subject']
//     },
//     monorepo: {
//         headerPattern: /^\[([^\]]+)\]\s+(\w+)(?:\s+\(([^)]+)\))?(?:\s+\[(issue\s+#\d+)\])?:\s+(.+)$/,
//         headerCorrespondence: ['package', 'type', 'scope', 'ticket', 'subject']
//     }
// };

// module.exports = presets;
