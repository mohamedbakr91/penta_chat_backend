import { IncludeOptions, Model, ModelStatic } from "sequelize";
import { BaseFindAllDTO } from "../dto";

export function buildIncludeConfig<T extends Model>(dto: BaseFindAllDTO<T>, model: ModelStatic<T>): IncludeOptions[] {
  const includes: IncludeOptions[] = [];

  if (!dto.include) {
    return includes; // Return empty array if no includes are defined
  }

  for (const [relation, config] of Object.entries(dto.include)) {
    // Get the association metadata for the model
    const association = model.associations[relation];
    if (!association) {
      throw new Error(`Association '${relation}' not found in model '${model.name}'.`);
    }

    includes.push({
      model: association.target as ModelStatic<any>, // Explicitly cast to ModelStatic
      attributes: (config as any)?.attributes || undefined,
      where: (config as any)?.where || undefined,
      required: (config as any)?.required || false,
      as: relation,
    });
  }

  return includes;
}
