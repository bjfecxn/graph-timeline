// @ts-nocheck
import { decompileGroup, isGroup } from './common';
import identity from './identity';

var top = 1,
  right = 2,
  bottom = 3,
  left = 4,
  epsilon = 1e-6;

function translateX(x) {
  return 'translate(' + x + ',0)';
}

function translateY(y) {
  return 'translate(0,' + y + ')';
}

function number(scale) {
  return (d) => +scale(d);
}

function center(scale, offset) {
  offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
  if (scale.round()) offset = Math.round(offset);
  return (d) => +scale(d) + offset;
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale, yOffset = 0) {
  var tickArguments = [],
    tickValues = null,
    tickFormat = null,
    tickSizeInner = 6,
    tickSizeOuter = 6,
    tickPadding = 3,
    offset = typeof window !== 'undefined' && window.devicePixelRatio > 1 ? 0 : 0.5,
    k = orient === top || orient === left ? -1 : 1,
    x = orient === left || orient === right ? 'x' : 'y',
    transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values =
        tickValues == null
          ? scale.ticks
            ? scale.ticks.apply(scale, tickArguments)
            : scale.domain()
          : tickValues,
      format =
        tickFormat == null
          ? scale.tickFormat
            ? scale.tickFormat.apply(scale, tickArguments)
            : identity
          : tickFormat,
      spacing = Math.max(tickSizeInner, 0) + tickPadding,
      range = scale.range(),
      position = (scale.bandwidth ? center : number)(scale.copy(), offset),
      selection = context.selection ? context.selection() : context,
      tick = selection.selectAll('.tick').data(values, scale).order(),
      tickExit = tick.exit(),
      tickEnter = tick.enter().append('g').attr('class', 'tick'),
      line = tick.select('line'),
      label = tick.select('text._label'),
      rect = tick.select('rect'),
      icon = tick.select('circle'),
      iconText = tick.select('text._icon');

    tick = tick.merge(tickEnter);
    tickEnter.filter((domain) => !isGroup(domain)).attr('class', 'tick _node');

    line = line.merge(
      tickEnter
        .filter((domain) => !isGroup(domain))
        .append('line')
        .attr('stroke', 'currentColor')
        .attr(x + '2', k * tickSizeInner),
    );

    icon = icon.merge(tickEnter.filter((domain) => !isGroup(domain)).append('circle'));

    iconText = iconText.merge(
      tickEnter
        .filter((domain) => !isGroup(domain))
        .append('text')
        .attr('class', '_icon'),
    );

    label = label.merge(
      tickEnter
        .append('text')
        // .attr('fill', 'currentColor')
        .attr('fill', '#0A1B39')
        .attr('class', '_label')
        .attr(x, k * spacing + yOffset)
        .attr('dy', orient === top ? '0em' : orient === bottom ? '0.71em' : '0.32em'),
    );

    const rectHeight = Math.min(18, scale.step());
    rect = rect
      .merge(tickEnter.filter((domain) => !isGroup(domain)).append('rect'))
      .attr('width', tickSizeInner)
      .attr('height', rectHeight)
      .attr('x', k * tickSizeInner)
      .attr('y', -rectHeight / 2);

    if (context !== selection) {
      tick = tick.transition(context);
      line = line.transition(context);
      label = label.transition(context);

      tickExit = tickExit
        .transition(context)
        .attr('opacity', epsilon)
        .attr('transform', function (d) {
          return isFinite((d = position(d)))
            ? transform(d + offset)
            : this.getAttribute('transform');
        });

      tickEnter.attr('opacity', epsilon).attr('transform', function (d) {
        var p = this.parentNode.__axis;
        return transform((p && isFinite((p = p(d))) ? p : position(d)) + offset);
      });
    }

    tickExit.remove();

    tick.attr('opacity', 1).attr('transform', function (d) {
      return transform(position(d) + offset);
    });

    line.attr(x + '2', k * tickSizeInner);
    icon.attr('c' + x, k * spacing - 5);
    label
      .attr(x, (domain) => {
        const domainIsGroup = isGroup(domain);
        if (!domainIsGroup) return k * spacing - 20 + yOffset + 24;
        const { level } = decompileGroup(domain);
        if (level === 2) return k * spacing - 20 + yOffset + 12;
        return k * spacing - 20 + yOffset;
      })
      .text(format);
    iconText.attr(x, k * spacing - 5);

    selection
      .filter(entering)
      .attr('fill', 'none')
      .attr('font-size', 10)
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'start');

    selection.each(function () {
      this.__axis = position;
    });
  }

  axis.scale = function (_) {
    return arguments.length ? ((scale = _), axis) : scale;
  };

  axis.ticks = function () {
    return (tickArguments = Array.from(arguments)), axis;
  };

  axis.tickArguments = function (_) {
    return arguments.length
      ? ((tickArguments = _ == null ? [] : Array.from(_)), axis)
      : tickArguments.slice();
  };

  axis.tickValues = function (_) {
    return arguments.length
      ? ((tickValues = _ == null ? null : Array.from(_)), axis)
      : tickValues && tickValues.slice();
  };

  axis.tickFormat = function (_) {
    return arguments.length ? ((tickFormat = _), axis) : tickFormat;
  };

  axis.tickSize = function (_) {
    return arguments.length ? ((tickSizeInner = tickSizeOuter = +_), axis) : tickSizeInner;
  };

  axis.tickSizeInner = function (_) {
    return arguments.length ? ((tickSizeInner = +_), axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function (_) {
    return arguments.length ? ((tickSizeOuter = +_), axis) : tickSizeOuter;
  };

  axis.tickPadding = function (_) {
    return arguments.length ? ((tickPadding = +_), axis) : tickPadding;
  };

  axis.offset = function (_) {
    return arguments.length ? ((offset = +_), axis) : offset;
  };

  return axis;
}

export function axisRight(scale) {
  return axis(right, scale);
}

export function axisLeft(scale, yOffset) {
  return axis(left, scale, yOffset);
}
