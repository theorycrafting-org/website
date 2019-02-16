const hSB = require("./charts/horizontalStackedBar.js");
const D3Node = require("d3-node");

function chart_render(state, start, end, silent) {
    var firstLine, lastLine, next, lastPos, found = false,
        pos = state.bMarks[start] + state.tShift[start],
        max = state.eMarks[start]
        if (!state.tokens[state.tokens.length-1] || state.tokens[state.tokens.length-1].type !== "table_close") return false;
        if (state.src.slice(pos, pos+7) !== "^chart(") return false;
        let buffer = "";
        let nesting = 1;
        var i = pos+7;
        while (nesting > 0 && i <= max) {
            if (state.src[i] == ")") {
                nesting--;
                if (nesting == 0) {
                    break;
                }
            }
            if (state.src[i] == "(") {
                nesting++;
            }
            buffer = buffer + state.src[i];
            i++;
        }
        console.log(buffer);
        let settingsOut = pos+7+buffer.length+1;
        let out = JSON.parse(buffer);

        if (!out || !out.type) {
            return false;
        }
        // Find the start of the table
        var idx = state.tokens.length-1;
        var startToken = -1;
        while ((idx > 0) && startToken == -1) {
            //console.log(state.tokens[idx]);
            if (state.tokens[idx].type === "table_open") {
                startToken = idx;
            } else {
                idx--;
            }
        }
        if (startToken == -1) return false;
        var condense_token = function(startIdx) {
            var lookFor = null;
            switch (state.tokens[startIdx].type) {
                case "th_open":
                    lookFor = "th_close";
                    break;
                case "td_open":
                    lookFor = "td_close";
                    break;
            }
            if (!lookFor) return null;
            var i = 0;
            var content = "";
            while (i >= 0) {
                if (!state.tokens[startIdx+i]) {
                    return null;
                }
                if (state.tokens[startIdx+i].type == lookFor) {
                    return content;
                }
                content = content + state.tokens[startIdx+i].content;
                i++;
            }
        };

        var table = [];
        var currentRow = [];
        for (i = startToken; i < state.tokens.length; i++) {
            switch (state.tokens[i].type) {
                case "tr_close":
                    table.push(currentRow.splice(0));
                    break;
                case "td_open":
                case "th_open":
                    currentRow.push(condense_token(i));
                    break;
            }
        }
        
        if (out.hideData) {
            state.tokens.splice(startToken, state.tokens.length-startToken);
        }
        var series = [];
        if (out.axis == "x") {
            for (var row = 1; row < table.length; row++) {
                series.push({
                    name: table[row][0],
                    legend: table[0].slice(1),
                    values: table[row].slice(1).map(v => parseFloat(v))
                });
            }
        } else {
            var legend = [];
            for (var y = 1; y < table.length; y++) {
                legend.push(table[y][0]);
            }
            for (var col = 1; col < table[0].length; col++) {
                var values = [];
                for (var y = 1; y < table.length; y++) {
                    values.push(table[y][col]);
                }
                series.push({
                    name: table[0][col],
                    values: values,
                    legend: legend
                });
            }
        }
        // console.log(series);
        const options = { selector: '#chart', container: '<div id="container"><div id="chart"></div></div>' };
        const d3n = new D3Node(options) // initializes D3 with container element
        const d3 = d3n.d3;
        let chart = hSB(d3.select(d3n.document.querySelector('#chart')), d3, {});
        chart(series);
        console.log(d3n.chartHTML().toString());
        var token = state.push('chart_render', 'test', 1);
        token.block = true;
        token.attrs = {
            type: out.type,
            data: series,
            html: d3n.chartHTML().toString()
        };
        state.pos = settingsOut;
        token.map = [start, start+1];
        state.line = start+1;
        return true;
}

var inlineRenderer = function(tokens, idx) {
    return tokens[idx].attrs.html;
};
module.exports = function(md, options) {
    md.block.ruler.after('table', 'chart_render', chart_render);
    md.renderer.rules.chart_render = inlineRenderer;
};