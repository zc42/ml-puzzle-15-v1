export class Semaphore {
    private enabled: boolean = true;
    private id: number = 0;

    public enable(): number {
        this.id++;
        this.enabled = true;
        return this.id;
    }

    public disable() {
        this.enabled = false;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public goodToGo(id: number | null): boolean {
        if (!this.enabled) return false;
        if (id !== this.id) return false;
        return true;
    }
}