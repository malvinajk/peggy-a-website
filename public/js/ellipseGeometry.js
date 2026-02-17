// EllipseGeometry class to compute positions and rotations on an ellipse 

class EllipseGeometry {
    constructor(wrapper) {
        this.wrapper = wrapper;
        this.radiusX = 0;
        this.radiusY = 0;
    }

    // Adjust radii based on window size
    updateResponsiveRadii(w, h) {
        if (w > 1024) {
            this.radiusX = w * 0.35;
            this.radiusY = h * 0.3;
        } else if (w > 640) {
            this.radiusX = w * 0.4;
            this.radiusY = h * 0.3;
        } else {
            this.radiusX = w * 0.4;
            this.radiusY = h * 0.25;
        }
    }

    // Calculate position on the ellipse for a given angle
    computePosition(angle) {
        const centerX = this.wrapper.clientWidth / 2;
        const centerY = this.wrapper.clientHeight / 2;

        const x = centerX + this.radiusX * Math.cos(angle);
        const y = centerY + this.radiusY * Math.sin(angle);

        return { x, y };
    }

    // Calculate rotation angle for a title item at a given angle
    computeRotation(angle) {
        const a = this.radiusX;
        const b = this.radiusY;

        const tangentAngle = Math.atan2(
            b * Math.cos(angle),
            -a * Math.sin(angle)
        );

        return tangentAngle * (180 / Math.PI);
    }
}

export { EllipseGeometry };
