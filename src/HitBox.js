class HitBox {
  constructor(mid_pos, size) {
    this.mid_pos = mid_pos;
    this.angle = 0;
    this.size = size;
  }

  set_pos(mid_pos) {
    this.mid_pos = mid_pos;
  }

  // Copied from: https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
  static is_point_in_triangle(s, a, b, c) {
    const as_x = s.x - a.x;
    const as_y = s.y - a.y;

    const s_ab = (b.x - a.x) * as_y - (b.y - a.y) * as_x > 0;

    if ((c.x - a.x) * as_y - (c.y - a.y) * as_x > 0 == s_ab) return false;
    if ((c.x - b.x) * (s.y - b.y) - (c.y - b.y) * (s.x - b.x) > 0 != s_ab)
      return false;
    return true;
  }

  set_angle(angle) {
    this.angle = angle;
  }

  // Copied from: https://gamedev.stackexchange.com/questions/86755/how-to-calculate-corner-positions-marks-of-a-rotated-tilted-rectangle
  points() {
    const c = cos(this.angle);
    const s = sin(this.angle);
    const r1x = -(this.size[0] / 2) * c - (this.size[1] / 2) * s;
    const r1y = -(this.size[0] / 2) * s + (this.size[1] / 2) * c;
    const r2x = (this.size[0] / 2) * c - (this.size[1] / 2) * s;
    const r2y = (this.size[0] / 2) * s + (this.size[1] / 2) * c;

    // Returns four points in clockwise order starting from the top left.
    return [
      createVector(this.mid_pos[0] + r1x, this.mid_pos[1] + r1y),
      createVector(this.mid_pos[0] + r2x, this.mid_pos[1] + r2y),
      createVector(this.mid_pos[0] - r1x, this.mid_pos[1] - r1y),
      createVector(this.mid_pos[0] - r2x, this.mid_pos[1] - r2y)
    ];
  }

  static triangles_from_points(points) {
    return [
      [points[0], points[1], points[2]],
      [points[0], points[3], points[2]]
    ];
  }

  is_colliding(other) {
    const points = this.points();
    const opoints = other.points();

    const triangles = HitBox.triangles_from_points(points);
    const otriangles = HitBox.triangles_from_points(opoints);

    if (
      opoints.some(point => {
        return (
          HitBox.is_point_in_triangle(point, ...triangles[0]) ||
          HitBox.is_point_in_triangle(point, ...triangles[1])
        );
      })
    )
      return true;

    if (
      points.some(point => {
        return (
          HitBox.is_point_in_triangle(point, ...otriangles[0]) ||
          HitBox.is_point_in_triangle(point, ...otriangles[1])
        );
      })
    )
      return true;

    return false;
  }

  show() {
    if (!SHOW_HITBOXES) return;

    stroke('red');
    strokeWeight(1);
    HitBox.triangles_from_points(this.points()).forEach(triangle => {
      for (let i = 0; i < 3; i++) {
        line(
          triangle[i].x,
          triangle[i].y,
          triangle[(i + 1) % 3].x,
          triangle[(i + 1) % 3].y
        );
      }
    });
  }
}
