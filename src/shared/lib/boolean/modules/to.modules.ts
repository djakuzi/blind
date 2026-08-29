function toValue(value: unknown): boolean {
        if (typeof value === 'boolean') {
            return value
        }

        if (typeof value === 'number') {
            return value !== 0
        }

        if (typeof value === 'string') {
            const normalizedValue = value.trim();

            return (
            normalizedValue === 'y'
            || normalizedValue === 'yes'
            || normalizedValue === 'true'
            || normalizedValue === '1'
            )
        }

        return false
    }


export const moduleTo = {
    toValue 
}