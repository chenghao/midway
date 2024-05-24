import { OmitDto, PickDto, Rule, RuleType } from "@midwayjs/validate";

export class TestReq {
    // 自定义错误信息
    //@Rule(RuleType.number().required().error(new Error("id不能为空")))

    @Rule(RuleType.number().required().error(new Error("id不能为空")))
    id: number;

    @Rule(RuleType.string().required().error(new Error("第一个名字不能为空")))
    firstName: string;

    @Rule(RuleType.string().max(10).error(new Error("最后一个名字最大10个字符")))
    lastName: string;

    @Rule(RuleType.number().max(60).error(new Error("年龄最大60")))
    age: number;
}

/**
 * PickDto 用于从现有的 DTO 中获取一些属性，变成新的 DTO
 * 继承出一个新的Req，只包含firstName和lastName字段
 */
export class PickTestReq extends PickDto(TestReq, ["firstName", "lastName"]) {}

/**
 * OmitDto 用于从现有的 DTO 将其中某些属性剔除，变成新的 DTO
 * 继承出一个新的Req，不包含age字段
 */
export class OmitTestReq extends OmitDto(TestReq, ["age"]) {}

export class Test1Req {
    @Rule(RuleType.string().required().error(new Error("名字不能为空")).max(10).error(new Error("名字最长10个字符")))
    name: string;
}
