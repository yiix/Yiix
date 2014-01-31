<?php
namespace YiiEx;
class CDbCriteria extends \CDbCriteria{
    /**
	 * Merges with another criteria.
	 * In general, the merging makes the resulting criteria more restrictive.
	 * For example, if both criterias have conditions, they will be 'AND' together.
	 * Also, the criteria passed as the parameter takes precedence in case
	 * two options cannot be merged (e.g. LIMIT, OFFSET).
	 * @param mixed $criteria the criteria to be merged with. Either an array or CDbCriteria.
	 * @param string|boolean $operator the operator used to concatenate where and having conditions. Defaults to 'AND'.
	 * For backwards compatibility a boolean value can be passed:
	 * - 'false' for 'OR'
	 * - 'true' for 'AND'
	 */
	public function inlineMergeWith($criteria,$operator='AND')
	{
		if(is_bool($operator))
			$operator=$operator ? 'AND' : 'OR';
		if(is_array($criteria))
			$criteria=new self($criteria);
		if($this->select!==$criteria->select)
		{
			if($this->select==='*')
				$this->select=$criteria->select;
			elseif($criteria->select!=='*')
			{
				$select1=is_string($this->select)?preg_split('/\s*,\s*/',trim($this->select),-1,PREG_SPLIT_NO_EMPTY):$this->select;
				$select2=is_string($criteria->select)?preg_split('/\s*,\s*/',trim($criteria->select),-1,PREG_SPLIT_NO_EMPTY):$criteria->select;
				$this->select=array_merge($select1,array_diff($select2,$select1));
			}
		}

		if($this->condition!==$criteria->condition)
		{
			if($this->condition==='')
				$this->condition=$criteria->condition;
			elseif($criteria->condition!=='')
				$this->condition="{$this->condition} $operator ({$criteria->condition})";
		}

		if($this->params!==$criteria->params)
			$this->params=array_merge($this->params,$criteria->params);

		if($criteria->limit>0)
			$this->limit=$criteria->limit;

		if($criteria->offset>=0)
			$this->offset=$criteria->offset;

		if($criteria->alias!==null)
			$this->alias=$criteria->alias;

		if($this->order!==$criteria->order)
		{
			if($this->order==='')
				$this->order=$criteria->order;
			elseif($criteria->order!=='')
				$this->order=$criteria->order.', '.$this->order;
		}

		if($this->group!==$criteria->group)
		{
			if($this->group==='')
				$this->group=$criteria->group;
			elseif($criteria->group!=='')
				$this->group.=', '.$criteria->group;
		}

		if($this->join!==$criteria->join)
		{
			if($this->join==='')
				$this->join=$criteria->join;
			elseif($criteria->join!=='')
				$this->join.=' '.$criteria->join;
		}

		if($this->having!==$criteria->having)
		{
			if($this->having==='')
				$this->having=$criteria->having;
			elseif($criteria->having!=='')
				$this->having="({$this->having}) $operator ({$criteria->having})";
		}

		if($criteria->distinct>0)
			$this->distinct=$criteria->distinct;

		if($criteria->together!==null)
			$this->together=$criteria->together;

		if($criteria->index!==null)
			$this->index=$criteria->index;

		if(empty($this->scopes))
			$this->scopes=$criteria->scopes;
		elseif(!empty($criteria->scopes))
		{
			$scopes1=(array)$this->scopes;
			$scopes2=(array)$criteria->scopes;
			foreach($scopes1 as $k=>$v)
			{
				if(is_integer($k))
					$scopes[]=$v;
				elseif(isset($scopes2[$k]))
					$scopes[]=array($k=>$v);
				else
					$scopes[$k]=$v;
			}
			foreach($scopes2 as $k=>$v)
			{
				if(is_integer($k))
					$scopes[]=$v;
				elseif(isset($scopes1[$k]))
					$scopes[]=array($k=>$v);
				else
					$scopes[$k]=$v;
			}
			$this->scopes=$scopes;
		}

		if(empty($this->with))
			$this->with=$criteria->with;
		elseif(!empty($criteria->with))
		{
			$this->with=(array)$this->with;
			foreach((array)$criteria->with as $k=>$v)
			{
				if(is_integer($k))
					$this->with[]=$v;
				elseif(isset($this->with[$k]))
				{
					$excludes=array();
					foreach(array('joinType','on') as $opt)
					{
						if(isset($this->with[$k][$opt]))
							$excludes[$opt]=$this->with[$k][$opt];
						if(isset($v[$opt]))
							$excludes[$opt]= ($opt==='on' && isset($excludes[$opt]) && $v[$opt]!==$excludes[$opt]) ?
								"($excludes[$opt]) AND $v[$opt]" : $v[$opt];
						unset($this->with[$k][$opt]);
						unset($v[$opt]);
					}
					$this->with[$k]=new self($this->with[$k]);
					$this->with[$k]->mergeWith($v,$operator);
					$this->with[$k]=$this->with[$k]->toArray();
					if (count($excludes)!==0)
						$this->with[$k]=CMap::mergeArray($this->with[$k],$excludes);
				}
				else
					$this->with[$k]=$v;
			}
		}
	}
}