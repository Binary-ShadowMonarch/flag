// src/lib/geometry/NepalFlagBuilder.ts
import type { Point2D, GeometryResult, FlagDecoration, ConstructionStepData } from '$lib/data/types';

interface ConstructionPoints {
  A: Point2D; B: Point2D; C: Point2D; D: Point2D; E: Point2D;
  F: Point2D; G: Point2D; H: Point2D; I: Point2D; J: Point2D;
  K: Point2D; L: Point2D; M: Point2D; N: Point2D; O: Point2D;
  P: Point2D; Q: Point2D; R: Point2D; S: Point2D; T: Point2D;
  U: Point2D; V: Point2D; W: Point2D;
}

export class NepalFlagBuilder {
  private scale: number;
  private AB: number;
  private points: Partial<ConstructionPoints> = {};
  private constructionLines: ConstructionStepData[] = [];

  constructor(scale: number = 100) {
    this.scale = scale;
    this.AB = scale; // Base unit
  }

  // Helper: Calculate distance between two points
  private distance(p1: Point2D, p2: Point2D): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }

  // Helper: Find intersection of two lines
  private lineIntersection(
    p1: Point2D, p2: Point2D, // Line 1
    p3: Point2D, p4: Point2D  // Line 2
  ): Point2D | null {
    const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(denom) < 1e-10) return null;

    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
    return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
  }

  // Helper: Sample points along a line
  private sampleLine(p1: Point2D, p2: Point2D, segments: number = 2): Point2D[] {
    const points: Point2D[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      points.push({
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      });
    }
    return points;
  }

  // Helper: Sample points along an arc
  private sampleArc(
    center: Point2D,
    radius: number,
    startAngle: number,
    endAngle: number,
    segments: number = 20
  ): Point2D[] {
    const points: Point2D[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = startAngle + t * (endAngle - startAngle);
      points.push({
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
      });
    }
    return points;
  }

  // Helper: Sample points along a circle
  private sampleCircle(center: Point2D, radius: number, segments: number = 30): Point2D[] {
    return this.sampleArc(center, radius, 0, Math.PI * 2, segments);
  }

  // Step 1: Draw line AB
  private step1() {
    this.points.A = { x: 0, y: 0 };
    this.points.B = { x: this.AB, y: 0 };
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.A, this.points.B),
      label: 'AB',
      color: '#666'
    });
  }

  // Step 2: Draw AC perpendicular, AC = AB + 1/3 AB
  private step2() {
    const AC = this.AB * (4 / 3);
    this.points.C = { x: 0, y: AC };
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.A!, this.points.C),
      label: 'AC',
      color: '#666'
    });
  }

  // Step 3: Mark D on AC where AD = AB, join BD
  private step3() {
    this.points.D = { x: 0, y: this.AB };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.D],
      label: 'D',
      color: '#f00'
    });
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.B!, this.points.D),
      label: 'BD',
      color: '#666'
    });
  }

  // Step 4: From BD mark E making BE = AB
  private step4() {
    // E is on line BD at distance AB from B
    const B = this.points.B!;
    const D = this.points.D!;
    const bdLength = this.distance(B, D);
    const t = this.AB / bdLength;
    this.points.E = {
      x: B.x + t * (D.x - B.x),
      y: B.y + t * (D.y - B.y)
    };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.E],
      label: 'E',
      color: '#f00'
    });
  }

  // Step 5: Draw FG parallel to AB, FG = AB
  private step5() {
    const E = this.points.E!;
    // F is on AC at same y as E
    this.points.F = { x: 0, y: E.y };
    this.points.G = { x: this.AB, y: E.y };
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.F, this.points.G),
      label: 'FG',
      color: '#666'
    });
  }

  // Step 6: Mark AH = 1/4 AB, draw HI parallel to AC
  private step6() {
    this.points.H = { x: this.AB / 4, y: 0 };
    // I is intersection of line through H parallel to AC with line CG
    const C = this.points.C!;
    const G = this.points.G!;
    // Line through H parallel to AC is vertical line x = H.x
    // Line CG: find where x = H.x intersects CG
    const t = (this.points.H.x - C.x) / (G.x - C.x);
    this.points.I = {
      x: this.points.H.x,
      y: C.y + t * (G.y - C.y)
    };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.H],
      label: 'H',
      color: '#f00'
    });
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.H, this.points.I),
      label: 'HI',
      color: '#666',
      dashed: true
    });
  }

  // Step 7: Bisect CF at J, draw JK parallel to AB
  private step7() {
    const C = this.points.C!;
    const F = this.points.F!;
    this.points.J = {
      x: (C.x + F.x) / 2,
      y: (C.y + F.y) / 2
    };
    // K is on CG at same y as J
    const G = this.points.G!;
    const t = (this.points.J.y - C.y) / (G.y - C.y);
    this.points.K = {
      x: C.x + t * (G.x - C.x),
      y: this.points.J.y
    };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.J],
      label: 'J',
      color: '#f00'
    });
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.J, this.points.K),
      label: 'JK',
      color: '#666',
      dashed: true
    });
  }

  // Step 8: L is intersection of JK and HI
  private step8() {
    // Both are at fixed x (HI) and fixed y (JK)
    this.points.L = {
      x: this.points.H!.x,
      y: this.points.J!.y
    };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.L],
      label: 'L',
      color: '#f00'
    });
  }

  // Step 9: Join J and G
  private step9() {
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.J!, this.points.G!),
      label: 'JG',
      color: '#666',
      dashed: true
    });
  }

  // Step 10: M is intersection of JG and HI
  private step10() {
    const J = this.points.J!;
    const G = this.points.G!;
    const H = this.points.H!;
    // HI is vertical at x = H.x
    // JG line: find y when x = H.x
    const t = (H.x - J.x) / (G.x - J.x);
    this.points.M = {
      x: H.x,
      y: J.y + t * (G.y - J.y)
    };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.M],
      label: 'M',
      color: '#f00'
    });
  }

  // Step 11: With centre M, mark N on HI (shortest distance from M to BD)
  private step11() {
    const M = this.points.M!;
    const B = this.points.B!;
    const D = this.points.D!;
    // Distance from M to line BD
    const dx = D.x - B.x;
    const dy = D.y - B.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const dist = Math.abs(dx * (B.y - M.y) - dy * (B.x - M.x)) / len;
    
    // N is below M on HI at distance dist
    this.points.N = {
      x: M.x,
      y: M.y - dist
    };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.N],
      label: 'N',
      color: '#f00'
    });
  }

  // Step 12: Draw OM parallel to AB
  private step12() {
    const M = this.points.M!;
    // O is on AC at same y as M
    this.points.O = { x: 0, y: M.y };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.O],
      label: 'O',
      color: '#f00'
    });
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.O, { x: M.x + this.AB / 2, y: M.y }),
      label: 'OM',
      color: '#666',
      dashed: true
    });
  }

  // Step 13: Semi-circle with center L, radius LN
  private step13() {
    const L = this.points.L!;
    const N = this.points.N!;
    const radius = this.distance(L, N);
    // Semi-circle on lower portion (below L)
    const arc = this.sampleArc(L, radius, Math.PI, 0, 30);
    this.constructionLines.push({
      type: 'arc',
      points: arc,
      label: 'L-semicircle',
      color: '#666',
      dashed: true
    });
    // Find P and Q where it touches OM
    const M = this.points.M!;
    const dy = L.y - M.y;
    const dx = Math.sqrt(radius * radius - dy * dy);
    this.points.P = { x: L.x - dx, y: M.y };
    this.points.Q = { x: L.x + dx, y: M.y };
  }

  // Step 14: Semi-circle with center M, radius MQ
  private step14() {
    const M = this.points.M!;
    const Q = this.points.Q!;
    const radius = this.distance(M, Q);
    const arc = this.sampleArc(M, radius, Math.PI, 0, 30);
    this.constructionLines.push({
      type: 'arc',
      points: arc,
      label: 'M-semicircle',
      color: '#666',
      dashed: true
    });
  }

  // Step 15: Arc with center N, radius NM
  private step15() {
    const N = this.points.N!;
    const M = this.points.M!;
    const radius = this.distance(N, M);
    // This creates points R and S
    const P = this.points.P!;
    const Q = this.points.Q!;
    
    // Find angles to P and Q from N
    const angleP = Math.atan2(P.y - N.y, P.x - N.x);
    const angleQ = Math.atan2(Q.y - N.y, Q.x - N.x);
    
    const arc = this.sampleArc(N, radius, angleQ, angleP, 30);
    this.constructionLines.push({
      type: 'arc',
      points: arc,
      label: 'N-arc',
      color: '#666',
      dashed: true
    });
    
    // R and S are the intersection points (approximated as endpoints)
    this.points.R = arc[0];
    this.points.S = arc[arc.length - 1];
    
    // T is where RS intersects HI
    this.points.T = {
      x: this.points.H!.x,
      y: (this.points.R.y + this.points.S.y) / 2
    };
  }

  // Step 16: Semi-circle with center T, radius TS
  private step16() {
    const T = this.points.T!;
    const S = this.points.S!;
    const radius = this.distance(T, S);
    const arc = this.sampleArc(T, radius, 0, Math.PI, 30);
    this.constructionLines.push({
      type: 'arc',
      points: arc,
      label: 'T-semicircle-outer',
      color: '#666',
      dashed: true
    });
  }

  // Step 17: Arc with center T, radius TM
  private step17() {
    const T = this.points.T!;
    const M = this.points.M!;
    const radius = this.distance(T, M);
    const arc = this.sampleArc(T, radius, 0, Math.PI, 30);
    this.constructionLines.push({
      type: 'arc',
      points: arc,
      label: 'T-arc-inner',
      color: '#666',
      dashed: true
    });
  }

  // Step 18: Moon triangles (8 triangles)
  private step18() {
    // These will be created as decorations
  }

  // Step 19: Bisect AF at U, draw UV parallel to AB
  private step19() {
    const A = this.points.A!;
    const F = this.points.F!;
    this.points.U = {
      x: (A.x + F.x) / 2,
      y: (A.y + F.y) / 2
    };
    // V is on BE at same y as U
    const B = this.points.B!;
    const E = this.points.E!;
    const t = (this.points.U.y - B.y) / (E.y - B.y);
    this.points.V = {
      x: B.x + t * (E.x - B.x),
      y: this.points.U.y
    };
    this.constructionLines.push({
      type: 'point',
      points: [this.points.U],
      label: 'U',
      color: '#f00'
    });
    this.constructionLines.push({
      type: 'line',
      points: this.sampleLine(this.points.U, this.points.V),
      label: 'UV',
      color: '#666',
      dashed: true
    });
  }

  // Step 20: Circle with center W, radius MN
  private step20() {
    // W is intersection of HI and UV
    this.points.W = {
      x: this.points.H!.x,
      y: this.points.U!.y
    };
    const M = this.points.M!;
    const N = this.points.N!;
    const radius = this.distance(M, N);
    const circle = this.sampleCircle(this.points.W, radius, 40);
    this.constructionLines.push({
      type: 'circle',
      points: circle,
      label: 'W-outer-circle',
      color: '#666',
      dashed: true
    });
  }

  // Step 21: Circle with center W, radius LN
  private step21() {
    const W = this.points.W!;
    const L = this.points.L!;
    const N = this.points.N!;
    const radius = this.distance(L, N);
    const circle = this.sampleCircle(W, radius, 40);
    this.constructionLines.push({
      type: 'circle',
      points: circle,
      label: 'W-inner-circle',
      color: '#666',
      dashed: true
    });
  }

  // Step 22: Sun triangles (12 triangles)
  private step22() {
    // These will be created as decorations
  }

  // Build full geometry
  build(): GeometryResult {
    return this.buildUpToStep(24);
  }

  // Build up to specific step
  buildUpToStep(targetStep: number): GeometryResult {
    this.points = {};
    this.constructionLines = [];

    // Execute steps sequentially
    const steps = [
      () => this.step1(),
      () => this.step2(),
      () => this.step3(),
      () => this.step4(),
      () => this.step5(),
      () => this.step6(),
      () => this.step7(),
      () => this.step8(),
      () => this.step9(),
      () => this.step10(),
      () => this.step11(),
      () => this.step12(),
      () => this.step13(),
      () => this.step14(),
      () => this.step15(),
      () => this.step16(),
      () => this.step17(),
      () => this.step18(),
      () => this.step19(),
      () => this.step20(),
      () => this.step21(),
      () => this.step22(),
    ];

    for (let i = 0; i < Math.min(targetStep, steps.length); i++) {
      steps[i]();
    }

    // Build the actual flag shape (outline)
    const shape = this.buildFlagShape();
    const decorations = this.buildDecorations(targetStep);

    return {
      shape,
      decorations,
      dimensions: {
        width: this.AB,
        height: this.AB * (4 / 3)
      },
      constructionLines: this.constructionLines
    };
  }

  // Build flag outline
  private buildFlagShape(): Point2D[] {
    const A = this.points.A || { x: 0, y: 0 };
    const B = this.points.B || { x: this.AB, y: 0 };
    const E = this.points.E || { x: this.AB, y: this.AB };
    const G = this.points.G || { x: this.AB, y: this.AB };
    const C = this.points.C || { x: 0, y: this.AB * (4 / 3) };

    return [A, B, E, G, C];
  }

  // Build decorations (moon and sun)
  private buildDecorations(step: number): FlagDecoration[] {
    const decorations: FlagDecoration[] = [];

    // Add moon (after step 18)
    if (step >= 18 && this.points.M) {
      const M = this.points.M;
      decorations.push({
        type: 'moon',
        position: { x: M.x, y: M.y, z: 0.1 },
        scale: this.AB / 8,
        color: '#FFFFFF',
        params: { rays: 8 }
      });
    }

    // Add sun (after step 22)
    if (step >= 22 && this.points.W) {
      const W = this.points.W;
      decorations.push({
        type: 'sun',
        position: { x: W.x, y: W.y, z: 0.1 },
        scale: this.AB / 6,
        color: '#FFFFFF',
        params: { rays: 12 }
      });
    }

    return decorations;
  }
}
