import type { Company } from "../../../models";

export async function load({ url, params, fetch }): Promise<Company> {
  // console.log("get company detail")
  const res = await fetch(`${url.origin}/api/v1/companies/${params.id}`);
	return await res.json() as Company;
};
