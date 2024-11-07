'use strict';

module.exports = {
    parserOpts: {
        headerPattern: /^(\w*!?)\s?(\(.+\))?\s?(\[.*\])*: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'ticket', 'subject'],
    },
};
