const pathSeparator = "/";

export class TriePath<T> {
	private values: T[] = [];
	private paths: Map<string, TriePath<T>> = new Map();
	private param: TriePath<T> | null = null;

	private getSubPath(prefix: string): TriePath<T> {
		const path = this.paths.get(prefix) ?? new TriePath();
		if (!this.paths.has(prefix)) {
			this.paths.set(prefix, path);
		}
		return path;
	}

	private getParamPath(): TriePath<T> {
		const path = this.param ?? new TriePath();
		if (!this.param) {
			this.param = path;
		}
		return path;
	}

	registerPath(path: string, value: T) {
		const parts = path.split(pathSeparator);
		const [first, ...remainder] = parts;
		if (typeof first !== "string") {
			throw new Error("An unknown error occurred");
		}
		const subPath =
			first[0] === ":" ? this.getParamPath() : this.getSubPath(first);
		if (remainder.length === 0) {
			subPath.values.push(value);
		} else {
			subPath.registerPath(remainder.join(pathSeparator), value);
		}
	}

	getFromPath(path: string): T[] {
		const parts = path.split(pathSeparator);
		const [first, ...remainder] = parts;
		if (typeof first !== "string") {
			throw new Error("An unknown error occurred");
		}
		const subPath = this.paths.get(first) ?? this.param;
		if (remainder.length === 0 && subPath) {
			return [...subPath.values];
		} else {
			if (!subPath) {
				return [];
			} else {
				return subPath.getFromPath(remainder.join(pathSeparator));
			}
		}
	}
}
