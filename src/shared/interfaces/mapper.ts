import { ClsService } from 'nestjs-cls';
import { FilesService } from 'src/files/files.service';
import { AllowedLanguages, IPaginatedResponse } from '.';
import { ICurrentRequestMeta } from './request-meta';

export abstract class Mapper<TInput, TOutput> {
  constructor(
    protected readonly fileService: FilesService,
    protected readonly clsService: ClsService,
  ) {}

  async mapSingle(input: TInput): Promise<TOutput> {
    const transformed = await this.transformKeys(
      input,
      this.clsService.get('meta'),
    );
    return this.customMapSingle(transformed);
  }

  /**
   * Maps a list of resources.
   */
  async mapList(inputs: TInput[]): Promise<TOutput[]> {
    return Promise.all(inputs.map((input) => this.mapSingle(input)));
  }

  async mapPaginatedList(
    input: IPaginatedResponse<TInput>,
  ): Promise<IPaginatedResponse<TOutput>> {
    return {
      data: await this.mapList(input.data),
      meta: input.meta,
    };
  }

  /**
   * Override this method for additional custom transformations in child classes.
   */
  protected async customMapSingle(input: Partial<TOutput>): Promise<TOutput> {
    return input as TOutput;
  }

  /**
   * Transforms keys ending with "Ar" or "En" based on the meta.language.
   */
  private async transformKeys(
    input: TInput,
    meta: ICurrentRequestMeta,
  ): Promise<Partial<TOutput>> {
    const output: Partial<TOutput> = { ...input } as Partial<TOutput>;
    const preferredSuffix =
      meta.language === AllowedLanguages.ar
        ? AllowedLanguages.ar
        : AllowedLanguages.en;

    for (const key in input) {
      if (key.endsWith('Ar') || key.endsWith('En')) {
        const baseKey = key.slice(0, -2); // Remove the suffix (e.g., "Ar" or "En")

        // Use the preferred language's value or fall back to English
        const preferredKey = `${baseKey}${preferredSuffix}`;
        const fallbackKey = `${baseKey}En`;

        output[baseKey] = input[preferredKey] || input[fallbackKey];
      }
    }

    // Transform image to a full URL if applicable
    if ((output as any).image) {
      (output as any).image = await this.fileService.getSignedUrlForDownload(
        (input as any).image,
      );
    }

    return output;
  }
}
