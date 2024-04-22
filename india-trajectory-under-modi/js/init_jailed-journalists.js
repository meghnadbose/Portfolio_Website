var pymChild = null;
var pymChild = new pym.Child();



var data = [
   
{'year': 2004, 'press': 0},
{'year': 2005, 'press': 0},
{'year': 2006, 'press': 0},
{'year': 2007, 'press': 0},
{'year': 2008, 'press': 0},
{'year': 2009, 'press': 1},
{'year': 2010, 'press': 0},
{'year': 2011, 'press': 2},
{'year': 2012, 'press': 3},
{'year': 2013, 'press': 1},
{'year': 2014, 'press': 1},
{'year': 2015, 'press': 4},
{'year': 2016, 'press': 1},
{'year': 2017, 'press': 2},
{'year': 2018, 'press': 1},
{'year': 2019, 'press': 2},
{'year': 2020, 'press': 4},
{'year': 2021, 'press': 7},
{'year': 2022, 'press': 7},
{'year': 2023, 'press': 7}
]


var winwidth = parseInt(d3.select('#chart-body-4').style('width'))

var winheight = parseInt(d3.select('#chart-body-4').style('height'))


var ƒ = d3.f

var sel = d3.select('#chart-body-4').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: winwidth, 
  height:  250, 
  margin: {left: 50, right: 50, top: 5, bottom: 30}
})

pymChild.sendHeight();

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.svg.append('circle').attr('cx',c.totalWidth*.44-5).attr('cy',c.height*.42).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',c.totalWidth*.35-5).attr('y',c.height*.340).text('Start dragging here').attr('class','intro-text')


c.x.domain([2004, 2024])
c.y.domain([100, 170])

c.xAxis.ticks(4).tickFormat(ƒ())
c.yAxis.ticks(5).tickFormat(d =>  d3.format(",.3r")(d))

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('press', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('press', c.y))

var clipRect = c.svg
  .append('clipPath#clip-4')
  .append('rect')
  .at({width: c.x(2014)-2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip-4)')

correctSel.append('path.area').at({d: area(data)})
correctSel.append('path.line').at({d: line(data)})
yourDataSel = c.svg.append('path#your-line-4').attr('class', 'your-line')

c.drawAxis()


yourData = data
  .map(function(d){ 
    return {year: d.year, press: d.press, defined: 0} })
  .filter(function(d){
    if (d.year == 2014) d.defined = true
    return d.year >= 2014
  })


var completed = false

var drag = d3.drag()
  .on('drag', function(){
    d3.selectAll('.intro-text').style('visibility', 'hidden')
    var pos = d3.mouse(this)
    var year = clamp(2014, 2023, c.x.invert(pos[0]))

    var press = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.press = press
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})

    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2023))
      d3.select('#answer-4').style('visibility', 'visible').html("<div>You guessed that India's rank on the World Press Freedom Index in 2023 was <p class='your-pink'>"+ d3.format(",.3r")(yourData[yourData.length-1].press) + "</p>.</div><div>India's rank was actually <p class='your-pink'>"+d3.format(",.3r")(data[19].press)+" </p> according to Reporters Without Borders, the organization that compiles the index.</div>")
      d3.select('#explain-4').style('visibility', 'visible').style('opacity', 1)
      pymChild.sendHeight();

    }
  })

c.svg.call(drag)



function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }