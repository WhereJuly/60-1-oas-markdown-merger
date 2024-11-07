'use strict';

const test = (r) => r.test.bind(r);

// WARNING: Use it with `defaultIgnores: true`
module.exports = [
    // WARNING: Only ignore `Merge | Merge branch`. Keep others.
    // test(/^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m),
    test(/^((Merge pull request)|(?:\r?\n)*$)/m),

    test(/^(Merge tag (.*?))(?:\r?\n)*$/m),
    test(/^(R|r)evert (.*)/),
    test(/^(R|r)eapply (.*)/),
    test(/^(amend|fixup|squash)!/),

    // And semver as well
    // isSemver,

    test(/^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/),
    test(/^Merge remote-tracking branch(\s*)(.*)/),
    test(/^Automatic merge(.*)/),
    test(/^Auto-merged (.*?) into (.*)/)
];
